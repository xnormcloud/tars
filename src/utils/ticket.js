const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config/config.json');

module.exports.create = (guild, message, type, customer) => {
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
                            if (category.permission != null) {
                                message.reply(`Channel successfully created in \`${category.name}\` category!`);
                            }
                        });
                    });
                });
            }
            catch (e) {
                console.error(e);
                if (message != null) {
                    message.reply('There was a problem creating the ticket');
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

function exists(guild, category, customer) {
    return guild.channels.cache.filter(channel => channel.name === customer && channel.parentId === category.id).size !== 0;
}
