const { MessageActionRow, MessageButton } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const config = require('../../config.json');
const colors = require('../constants/colors.js');
const responseCodes = require('../constants/responseCodes.json');
const notion = require('../database/notion.js');
const hash = require('../utils/hash.js');
const { guild, clientAvatar, ticketChannel } = require('../constants/discord.js');
const discord = require('../utils/discord.js');
const internal = require('../utils/internal.js');
const { capitalize } = require('../utils/string.js');

const inputChecker = (interaction, message, response) => {
    const isEvent = interaction !== null;
    const isCommand = message !== null;
    const isRequest = response !== null;
    return { isEvent, isCommand, isRequest };
};

const getTicketInfo = ticketType => {
    return config.tickets.find(ticketInfo => ticketInfo.name === ticketType);
};

const createTicketEmbed = (openTicketChannel, ticketInfo, locked) => {
    const embed = {
        color: locked ? colors.embed.red : colors.embed.blue,
        author: { name: `Welcome to ${capitalize(ticketInfo.name)} Ticket` },
        description: 'Please be patient, we will answer as soon as possible.',
        thumbnail: { url: clientAvatar },
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

    initDiscordMessage: async () => {
        ticketChannel.messages.fetch({ after: 1, limit: 1 }).then(ticketMessages => {
            if (ticketMessages.size !== 0) return;
            const embed = {
                color: colors.embed.blue,
                author: { name: 'Open Ticket Tool' },
                description: 'Select what category you want to open a ticket inside',
                thumbnail: { url: clientAvatar },
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

    open: async (ticketType, customerId, response, interaction, message) => {
        const { isEvent, isCommand, isRequest } = inputChecker(interaction, message, response);
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            const customerHash = hash.convert(customerId);
            if (!discord.isChannelByName(ticketInfo.category, customerHash)) {
                let discordIds;
                if (internal.isDiscordId(customerId)) {
                    // inside discord
                    if (discord.isMember(customerId)) {
                        discordIds = [customerId];
                    }
                    else {
                        if (isRequest) {
                            response.code = responseCodes.notFound;
                        }
                        return;
                    }
                }
                else if (internal.isNotionId(customerId)) {
                    // prevent update twice in a row, already updated in interactionCreate event
                    if (!isEvent) {
                        notion.updateDatabase();
                    }
                    discordIds = (await notion.database.getUsersIdsByGroupId(customerId)).UsersDiscordIds;
                    // not inside notion database
                    if (internal.isArrayEmpty(discordIds)) {
                        if (isRequest) {
                            response.code = responseCodes.notFound;
                        }
                        return;
                    }
                }
                // not valid id
                else {
                    if (isRequest) {
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
                                for (const discordId of discordIds) {
                                    const customerDiscord = discord.findMember(discordId);
                                    if (customerDiscord !== undefined) {
                                        await openTicketChannel.permissionOverwrites.edit(customerDiscord, {
                                            VIEW_CHANNEL: true,
                                            SEND_MESSAGES: true,
                                        });
                                    }
                                }
                                if (isRequest) {
                                    response.code = responseCodes.ok;
                                    response.channelLink = discord.generateChannelUrl(openTicketChannel.id);
                                }
                                else if (isEvent) {
                                    interaction.editReply(`${capitalize(ticketInfo.name)} Ticket <#${openTicketChannel.id}> successfully opened!`);
                                }
                                else if (isCommand) {
                                    message.reply(`Ticket successfully opened in ${ticketInfo.name} category!`);
                                }
                            });
                        });
                    });
                }
                catch (e) {
                    if (isRequest) {
                        response.code = responseCodes.internalServerError;
                    }
                    else {
                        const display_message = 'There was a problem opening the ticket';
                        if (isEvent) {
                            interaction.editReply(display_message);
                        }
                        else if (isCommand) {
                            message.reply(display_message);
                        }
                    }
                    console.error(e);
                }
            }
            else {
                const openTicketChannelId = discord.findChannelByName(ticketInfo.category, customerHash).id;
                if (isRequest) {
                    response.code = responseCodes.found;
                    response.channelLink = discord.generateChannelUrl(openTicketChannelId);
                }
                else if (isEvent) {
                    interaction.editReply(`You already have a ${capitalize(ticketInfo.name)} Ticket <#${openTicketChannelId}> opened!`);
                }
                else if (isCommand) {
                    message.reply(`Already existing channel <#${openTicketChannelId}> in ${ticketInfo.name} category!`);
                }
            }
        }
        else if (isCommand) {
            message.reply(`${ticketType} category doesn't exists!`);
        }
    },

    close: async (ticketType, customerHash, interaction, message) => {
        const { isEvent, isCommand } = inputChecker(interaction, message);
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            if (discord.isChannelByName(ticketInfo.category, customerHash)) {
                try {
                    const openTicketChannel = discord.findChannelByName(ticketInfo.category, customerHash);
                    const transcriptChannel = discord.findChannel(ticketInfo.log);
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
                            icon_url: clientAvatar,
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
                    if (isEvent) {
                        interaction.editReply('🔐 Ticket will be closed in 5 seconds!');
                    }
                    setTimeout(() => {
                        openTicketChannel.delete().then(() => {
                            if (isCommand) {
                                message.reply(`Channel successfully closed from ${ticketInfo.name} category!`);
                            }
                        });
                    }, 5000);
                }
                catch (error) {
                    const display_message = 'There was a problem closing the ticket';
                    if (isEvent) {
                        interaction.editReply(display_message);
                    }
                    else if (isCommand) {
                        message.reply(display_message);
                    }
                    console.error(error);
                }
            }
            else if (isCommand) {
                message.reply(`No provided customer channel in ${ticketInfo.name} category!`);
            }
        }
        else if (isCommand) {
            message.reply(`${ticketType} category doesn't exists!`);
        }
    },

    alternateLock: async (ticketType, customerHash, lock, interaction, message) => {
        // lock = true => lock ticket
        // lock = false => unlock ticket
        const { isEvent, isCommand } = inputChecker(interaction, message);
        const ticketInfo = getTicketInfo(ticketType);
        if (ticketInfo !== undefined) {
            if (discord.isChannelByName(ticketInfo.category, customerHash)) {
                try {
                    const openTicketChannel = discord.findChannelByName(ticketInfo.category, customerHash);
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
                            if (isEvent) {
                                interaction.editReply(display_message);
                            }
                            else if (isCommand) {
                                message.reply(display_message);
                            }
                        });
                    });
                }
                catch (error) {
                    const display_message = 'There was a problem ' + (lock ? 'locking' : 'unlocking') + ' the ticket';
                    if (isEvent) {
                        interaction.editReply(display_message);
                    }
                    else if (isCommand) {
                        message.reply(display_message);
                    }
                    console.error(error);
                }
            }
            else if (isCommand) {
                message.reply(`No provided customer channel in ${ticketInfo.name} category!`);
            }
        }
        else if (isCommand) {
            message.reply(`${ticketType} category doesn't exists!`);
        }
    },

};
