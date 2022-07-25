const { MessageActionRow, MessageButton } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const config = require('../../config.json');
const colors = require('../constants/colors.js');
const responseCodes = require('../constants/responseCodes.json');
const notion = require('../database/notion.js');
const hash = require('../utils/hash.js');
const { client, guild, ticketChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord.js');
const { capitalize } = require('../utils/string.js');

const getTicketInfo = ticketType => {
    return config.tickets.find(ticketInfo => ticketInfo.name === ticketType);
};

const exists = (ticketInfo, customerHash) => {
    return guild.channels.cache.some(channel => channel.parentId === ticketInfo.category && channel.name === customerHash);
};

const getOpenTicketChannel = (ticketInfo, customerHash) => {
    return guild.channels.cache.find(channel => channel.parentId === ticketInfo.category && channel.name === customerHash);
};

const createTicketEmbed = (openTicketChannel, ticketInfo, locked) => {
    const embed = {
        color: locked ? colors.embed.red : colors.embed.blue,
        author: { name: `Welcome to ${capitalize(ticketInfo.name)} Ticket` },
        description: 'Please be patient, we will answer as soon as possible.',
        thumbnail: { url: findAvatar(client.user) },
        fields: [
            { name: 'Important information', value: ticketInfo.info.join('\n') },
            { name: 'Status', value: locked ? '🔒 Locked' : '🔓 Unlocked' },
        ],
        timestamp: new Date(),
        footer: { text: `ID: ${openTicketChannel.id}` },
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
};

module.exports = {

    initDiscordMessage: async () => {
        ticketChannel.messages.fetch({ after: 1, limit: 1 }).then(ticketMessages => {
            if (ticketMessages.size !== 0) return;
            const embed = {
                color: colors.embed.blue,
                author: { name: 'Open Ticket Tool' },
                description: 'Select what category you want to open a ticket inside',
                thumbnail: { url: findAvatar(client.user) },
            };
            const buttons = new MessageActionRow();
            const fields = [];
            module.exports.getOpenInteractionList().map(openTicketInteraction => {
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
            ticketChannel.send({ embeds: [embed], components: [buttons] });
        });
    },

    getOpenInteractionList: () => {
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
    },

    isInsideDiscord: discordId => {
        return guild.members.cache.some(member => member.id === discordId);
    },

    open: async (ticketType, customer, response, interaction, message) => {
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            const customerHash = hash.convert(customer);
            if (!exists(ticketInfo, customerHash)) {
                const customerLen = customer.length;
                let customerIds;
                // discord id
                if (customerLen === 18) {
                    // inside discord
                    if (module.exports.isInsideDiscord(customer)) {
                        customerIds = [customer];
                    }
                    else {
                        if (response !== null) {
                            response.code = responseCodes.notFound;
                        }
                        return;
                    }
                }
                // group id
                else if (customerLen === 32) {
                    // prevent update twice in a row, already updated in interactionCreate event
                    if (interaction === null) {
                        notion.updateDatabase();
                    }
                    customerIds = (await notion.database.getUsersIdsByGroupId(customer)).UsersDiscordIds;
                    // not inside notion database
                    if (customerIds.length === 0) {
                        if (response !== null) {
                            response.code = responseCodes.notFound;
                        }
                        return;
                    }
                }
                // not valid id
                else {
                    if (response !== null) {
                        response.code = responseCodes.badRequest;
                    }
                    return;
                }
                // create
                try {
                    await guild.channels.create(customerHash).then(async channel => {
                        await channel.setParent(ticketInfo.category).then(async openTicketChannel => {
                            const [embed, buttons] = createTicketEmbed(openTicketChannel, ticketInfo, false);
                            await openTicketChannel.send({ embeds: [embed], components: [buttons] }).then(async () => {
                                for (const customerId of customerIds) {
                                    const customerDiscord = guild.members.cache.find(member => member.id === customerId);
                                    if (customerDiscord !== undefined) {
                                        await openTicketChannel.permissionOverwrites.edit(customerDiscord, {
                                            VIEW_CHANNEL: true,
                                            SEND_MESSAGES: true,
                                        });
                                    }
                                }
                                if (response != null) {
                                    response.code = responseCodes.ok;
                                    response.channelLink = `https://discord.com/channels/${guild.id}/${openTicketChannel.id}`;
                                }
                                else if (interaction != null) {
                                    interaction.editReply(`${capitalize(ticketInfo.name)} Ticket <#${openTicketChannel.id}> successfully opened!`);
                                }
                                else if (message != null) {
                                    message.reply(`Ticket successfully opened in ${ticketInfo.name} category!`);
                                }
                            });
                        });
                    });
                }
                catch (e) {
                    if (response != null) {
                        response.code = responseCodes.internalServerError;
                    }
                    else {
                        const display_message = 'There was a problem opening the ticket';
                        if (interaction != null) {
                            interaction.editReply(display_message);
                        }
                        else if (message != null) {
                            message.reply(display_message);
                        }
                    }
                    console.error(e);
                }
            }
            else {
                const openTicketChannelId = getOpenTicketChannel(ticketInfo, customerHash).id;
                if (response != null) {
                    response.code = responseCodes.found;
                    response.channelLink = `https://discord.com/channels/${guild.id}/${openTicketChannelId}`;
                }
                else if (interaction != null) {
                    interaction.editReply(`You already have a ${capitalize(ticketInfo.name)} Ticket <#${openTicketChannelId}> opened!`);
                }
                else if (message != null) {
                    message.reply(`Already existing channel <#${openTicketChannelId}> in ${ticketInfo.name} category!`);
                }
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
                    const openTicketChannel = getOpenTicketChannel(ticketInfo, customerHash);
                    const transcriptChannel = guild.channels.cache.find(channel => channel.id === ticketInfo.log);
                    const date = new Date();
                    const transcript = await createTranscript(openTicketChannel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${ticketType}_${date.toString().substring(0, date.toString().length - 39)}${customerHash}.html`,
                    });
                    const embed = {
                        color: colors.embed.red,
                        author: {
                            name: `Transcript ${ticketType}`,
                            icon_url: guild.members.cache.get(config.client).displayAvatarURL({
                                size: 4096,
                                dynamic: true,
                            }),
                        },
                        fields: [
                            { name: 'Ticket Name', value: openTicketChannel.name },
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
                        openTicketChannel.delete().then(() => {
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
                    const openTicketChannel = getOpenTicketChannel(ticketInfo, customerHash);
                    const customerIds = openTicketChannel.permissionOverwrites.cache.filter(member => member.type === 'member').map(member => {
                        return member.id;
                    });
                    for (const customerId of customerIds) {
                        const customerDiscord = guild.members.cache.find(member => member.id === customerId);
                        if (customerDiscord !== undefined) {
                            await openTicketChannel.permissionOverwrites.edit(customerDiscord, {
                                SEND_MESSAGES: !lock,
                            });
                        }
                    }
                    openTicketChannel.messages.fetch({ after: 1, limit: 1 }).then(ticketMessages => {
                        const embedTicketMessage = ticketMessages.first();
                        const [embed, buttons] = createTicketEmbed(openTicketChannel, ticketInfo, lock);
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
