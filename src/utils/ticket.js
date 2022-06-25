const { MessageActionRow, MessageButton } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const config = require('../config/config.json');

module.exports.open = (guild, message, type, customer) => {
    const category = config.categories.filter(group => group.name === type)[0];
    if (category !== undefined) {
        if (!exists(guild, category, customer)) {
            try {
                guild.channels.create(customer).then(channel => {
                    channel.setParent(category.id).then(() => {
                        const bot = guild.members.cache.filter(member => member.id === config.clientid).values().next().value;
                        const embed = {
                            color: config.colors.blue,
                            author: { name: `Welcome to ${category.name} ticket` },
                            description: 'Please be patient, we will answer as soon as possible',
                            thumbnail: { url: bot.displayAvatarURL({ size: 4096, dynamic: true }) },
                            fields: [ { name: 'Important info', value: category.info.join('\n') } ],
                            timestamp: new Date(),
                            footer: { text: `ID: ${channel.id}` },
                        };
                        const buttons = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('save_close_ticket')
                                    .setLabel('💾 Save & Close')
                                    .setStyle('PRIMARY'),
                                new MessageButton()
                                    .setCustomId('lock_ticket')
                                    .setLabel('🔒 Lock')
                                    .setStyle('DANGER'),
                                new MessageButton()
                                    .setCustomId('unlock_ticket')
                                    .setLabel('🔓 Unlock')
                                    .setStyle('SUCCESS'),
                                new MessageButton()
                                    .setURL('https://xnorm.cloud')
                                    .setLabel('🌐 Website')
                                    .setStyle('LINK'),
                            );
                        channel.send({ embeds: [embed], components: [buttons] }).then(() => {
                            if (message != null) {
                                message.reply(`Channel successfully opened in \`${category.name}\` category!`);
                            }
                        });
                    });
                });
            }
            catch (e) {
                console.error(e);
                if (message != null) {
                    message.reply('There was a problem opening the ticket');
                }
            }
        }
        else if (message != null) {
            message.reply(`Already existing channel in \`${category.name}\` category!`);
        }
    }
    else if (message != null) {
        message.reply(`\`${type}\` category doesn't exists!`);
    }
};

module.exports.close = async (guild, message, type, customer) => {
    const category = config.categories.filter(group => group.name === type)[0];
    if (category !== undefined) {
        if (exists(guild, category, customer)) {
            try {
                const ticketChannel = guild.channels.cache.filter(channel => channel.name === customer && channel.parentId === category.id).first();
                const transcriptChannel = guild.channels.cache.find(channel => channel.id === category.log);
                const date = new Date();
                const transcript = await createTranscript(ticketChannel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `${type}_${date.toString().substring(0, date.toString().length - 39)}${customer}.html`,
                });
                const embed = {
                    color: config.colors.red,
                    author: { name: `Transcript ${type}`, icon_url: guild.members.cache.get(config.clientid).displayAvatarURL({ size: 4096, dynamic: true }) },
                    fields: [
                        { name: 'Ticket Name', value: ticketChannel.name },
                        // TODO: setup direct transcript sys
                        { name: 'Direct Transcript', value: '[Direct Transcript](https://xnorm.cloud)' },
                        // TODO: get users who sent messages in ticketChannel
                        { name: 'Users in Transcript', value: 'users' },
                    ],
                    timestamp: date,
                    footer: { text: `ID: ${customer}` },
                };
                transcriptChannel.send({ embeds: [embed], files: [transcript] });
                ticketChannel.delete().then(() => {
                    if (message != null) {
                        message.reply(`Channel successfully closed from \`${category.name}\` category!`);
                    }
                });
            }
            catch (e) {
                console.error(e);
                if (message != null) {
                    message.reply('There was a problem closing the ticket');
                }
            }
        }
        else if (message != null) {
            message.reply(`No provided customer channel in \`${category.name}\` category!`);
        }
    }
    else if (message != null) {
        message.reply(`\`${type}\` category doesn't exists!`);
    }
};

function exists(guild, category, customer) {
    return guild.channels.cache.filter(channel => channel.name === customer && channel.parentId === category.id).size !== 0;
}
