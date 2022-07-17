const { MessageActionRow, MessageButton } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const config = require('../../config.json');
const notion = require('../database/notion.js');
const hash = require('../utils/hash.js');
const { capitalize } = require('../utils/string.js');

let guild;

module.exports = {

    initGuild: async guildEntry => {
        guild = guildEntry;
    },

    initDiscordMessage: async () => {
        const ticketMessageChannel = guild.channels.cache.find(channel => channel.id === config.channels.ticket);
        ticketMessageChannel.messages.fetch({ after: 1, limit: 1 }).then(ticketMessages => {
            if (ticketMessages.size !== 0) return;
            const bot = guild.members.cache.find(member => member.id === config.client);
            const embed = {
                color: config.colors.blue,
                author: { name: 'Open Ticket Tool' },
                description: 'Select what category you want to open a ticket inside',
                thumbnail: { url: bot.displayAvatarURL({ size: 4096, dynamic: true }) },
            };
            const buttons = new MessageActionRow();
            const fields = [];
            getOpenInteractionList().map(openTicketInteraction => {
                const openTicketInteractionName = capitalize(openTicketInteraction.name);
                fields.push({
                    name: openTicketInteractionName,
                    value: openTicketInteraction.description,
                });
                buttons.addComponents(
                    new MessageButton()
                        .setCustomId(openTicketInteraction.id)
                        .setLabel(`${openTicketInteraction.emoji} ${openTicketInteractionName}`)
                        .setStyle('SUCCESS'),
                );
            });
            embed.fields = fields;
            ticketMessageChannel.send({ embeds: [embed], components: [buttons] });
        });
    },

    getOpenInteractionList,

    open: async (ticketType, customer, interaction, message) => {
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            const customerHash = hash.convert(customer);
            if (!exists(ticketInfo, customerHash)) {
                try {
                    guild.channels.create(customerHash).then(channel => {
                        channel.setParent(ticketInfo.category).then(ticketChannel => {
                            const [embed, buttons] = createTicketEmbed(ticketChannel, ticketInfo, false);
                            ticketChannel.send({ embeds: [embed], components: [buttons] }).then(async () => {
                                let customerDiscord = guild.members.cache.find(member => member.id === customer);
                                // not group, only one user
                                if (customerDiscord !== undefined) {
                                    await ticketChannel.permissionOverwrites.edit(customerDiscord, {
                                        VIEW_CHANNEL: true,
                                        SEND_MESSAGES: true,
                                    });
                                }
                                // group
                                else {
                                    const customerIds = (await notion.getUsersIdsByGroupId(customer)).UsersDiscordIds;
                                    for (const customerId of customerIds) {
                                        customerDiscord = guild.members.cache.find(member => member.id === customerId);
                                        if (customerDiscord !== undefined) {
                                            await ticketChannel.permissionOverwrites.edit(customerDiscord, {
                                                VIEW_CHANNEL: true,
                                                SEND_MESSAGES: true,
                                            });
                                        }
                                    }
                                }
                                if (interaction != null) {
                                    interaction.editReply(`${capitalize(ticketInfo.name)} Ticket <#${ticketChannel.id}> successfully opened!`);
                                }
                                else if (message != null) {
                                    message.reply(`Ticket successfully opened in ${ticketInfo.name} category!`);
                                }
                            });
                        });
                    });
                }
                catch (e) {
                    const display_message = 'There was a problem opening the ticket';
                    if (interaction != null) {
                        interaction.editReply(display_message);
                    }
                    else if (message != null) {
                        message.reply(display_message);
                    }
                    console.error(e);
                }
            }
            else if (interaction != null) {
                const ticketChannelId = getTicketChannel(ticketInfo, customerHash).id;
                interaction.editReply(`You already have a ${capitalize(ticketInfo.name)} Ticket <#${ticketChannelId}> opened!`);
            }
            else if (message != null) {
                message.reply(`Already existing channel in ${ticketInfo.name} category!`);
            }
        }
        else if (message != null) {
            message.reply(`${ticketType} category doesn't exists!`);
        }
    },

    close: async (ticketType, customerHash, interaction, message) => {
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            if (exists(ticketInfo, customerHash)) {
                try {
                    const ticketChannel = getTicketChannel(ticketInfo, customerHash);
                    const transcriptChannel = guild.channels.cache.find(channel => channel.id === ticketInfo.log);
                    const date = new Date();
                    const transcript = await createTranscript(ticketChannel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${ticketType}_${date.toString().substring(0, date.toString().length - 39)}${customerHash}.html`,
                    });
                    const embed = {
                        color: config.colors.red,
                        author: {
                            name: `Transcript ${ticketType}`,
                            icon_url: guild.members.cache.get(config.client).displayAvatarURL({
                                size: 4096,
                                dynamic: true,
                            }),
                        },
                        fields: [
                            { name: 'Ticket Name', value: ticketChannel.name },
                            // TODO: setup direct transcript sys
                            { name: 'Direct Transcript', value: '[Direct Transcript](https://xnorm.cloud)' },
                            // TODO: get users who sent messages in ticketChannel
                            { name: 'Users in Transcript', value: 'users' },
                        ],
                        timestamp: date,
                        footer: { text: `ID: ${customerHash}` },
                    };
                    transcriptChannel.send({ embeds: [embed], files: [transcript] });
                    if (interaction != null) {
                        interaction.editReply('🔐 Ticket will be closed in 5 seconds!');
                    }
                    setTimeout(() => {
                        ticketChannel.delete().then(() => {
                            if (message != null) {
                                message.reply(`Channel successfully closed from ${ticketInfo.name} category!`);
                            }
                        });
                    }, 5000);
                }
                catch (error) {
                    const display_message = 'There was a problem closing the ticket';
                    if (interaction != null) {
                        interaction.editReply(display_message);
                    }
                    else if (message != null) {
                        message.reply(display_message);
                    }
                    console.error(error);
                }
            }
            else if (message != null) {
                message.reply(`No provided customer channel in ${ticketInfo.name} category!`);
            }
        }
        else if (message != null) {
            message.reply(`${ticketType} category doesn't exists!`);
        }
    },

    alternateLock: async (ticketType, customerHash, lock, interaction, message) => {
        // lock = true => lock ticket
        // lock = false => unlock ticket
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            if (exists(ticketInfo, customerHash)) {
                try {
                    const ticketChannel = getTicketChannel(ticketInfo, customerHash);
                    const customerIds = ticketChannel.permissionOverwrites.cache.filter(member => member.type === 'member').map(member => {
                        return member.id;
                    });
                    for (const customerId of customerIds) {
                        const customerDiscord = guild.members.cache.find(member => member.id === customerId);
                        if (customerDiscord !== undefined) {
                            await ticketChannel.permissionOverwrites.edit(customerDiscord, {
                                SEND_MESSAGES: !lock,
                            });
                        }
                    }
                    ticketChannel.messages.fetch({ after: 1, limit: 1 }).then(ticketMessages => {
                        const embedTicketMessage = ticketMessages.first();
                        const [embed, buttons] = createTicketEmbed(ticketChannel, ticketInfo, lock);
                        embedTicketMessage.edit({ embeds: [embed], components: [buttons] }).then(() => {
                            const display_message = (lock ? '🔒' : '🔓') + ' Ticket ' + (lock ? 'locked' : 'unlocked') + '!';
                            if (interaction != null) {
                                interaction.editReply(display_message);
                            }
                            else if (message != null) {
                                message.reply(display_message);
                            }
                        });
                    });
                }
                catch (error) {
                    const display_message = 'There was a problem ' + (lock ? 'locking' : 'unlocking') + ' the ticket';
                    if (interaction != null) {
                        interaction.editReply(display_message);
                    }
                    else if (message != null) {
                        message.reply(display_message);
                    }
                    console.error(error);
                }
            }
            else if (message != null) {
                message.reply(`No provided customer channel in ${ticketInfo.name} category!`);
            }
        }
        else if (message != null) {
            message.reply(`${ticketType} category doesn't exists!`);
        }
    },

};

function getOpenInteractionList() {
    // no button for invoice tickets, those are auto generated
    return config.tickets.filter(ticketInfo => ticketInfo.name !== 'invoice').map(ticketInfo => {
        return {
            name: ticketInfo.name,
            customer: ticketInfo.customer,
            description: ticketInfo.description,
            emoji: ticketInfo.emoji,
            id: 'open_' + ticketInfo.name + '_ticket',
        };
    });
}

function getTicketInfo(ticketType) {
    return config.tickets.find(ticketInfo => ticketInfo.name === ticketType);
}

function exists(ticketInfo, customerHash) {
    return guild.channels.cache.some(channel => channel.parentId === ticketInfo.category && channel.name === customerHash);
}

function getTicketChannel(ticketInfo, customerHash) {
    return guild.channels.cache.find(channel => channel.parentId === ticketInfo.category && channel.name === customerHash);
}

function createTicketEmbed(ticketChannel, ticketInfo, locked) {
    const bot = guild.members.cache.find(member => member.id === config.client);
    const embed = {
        color: locked ? config.colors.red : config.colors.blue,
        author: { name: `Welcome to ${capitalize(ticketInfo.name)} Ticket` },
        description: 'Please be patient, we will answer as soon as possible.',
        thumbnail: { url: bot.displayAvatarURL({ size: 4096, dynamic: true }) },
        fields: [
            { name: 'Important information', value: ticketInfo.info.join('\n') },
            { name: 'Status', value: locked ? '🔒 Locked' : '🔓 Unlocked' },
        ],
        timestamp: new Date(),
        footer: { text: `ID: ${ticketChannel.id}` },
    };
    const buttons = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('save_close_ticket')
                .setLabel('💾 Save & Close')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setURL('https://xnorm.cloud')
                .setLabel('🌐 Website')
                .setStyle('LINK'),
        );
    if (locked) {
        buttons.addComponents(
            new MessageButton()
                .setCustomId('unlock_ticket')
                .setLabel('🔓 Unlock')
                .setStyle('SUCCESS'),
        );
    }
    else {
        buttons.addComponents(
            new MessageButton()
                .setCustomId('lock_ticket')
                .setLabel('🔒 Lock')
                .setStyle('DANGER'),
        );
    }
    return [embed, buttons];
}
