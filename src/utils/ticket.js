const { MessageActionRow, MessageButton } = require('discord.js');
const config = require('../config/config.json');

module.exports.create = (type, customer, message) => {
    const category = config.categories.filter(group => group.name === type)[0];
    if (category !== undefined) {
        if (!exists(category, customer, message)) {
            message.guild.channels.create(customer).then(channel => {
                channel.setParent(category.id).then(() => {
                    const embed = {
                        color: config.colors.blue,
                        author: { name: `Welcome to ${category.name} ticket` },
                        description: 'Please be patient, we will answer as soon as possible',
                        fields: [ { name: 'Important info', value: category.info.join('') } ],
                        timestamp: new Date(),
                        footer: { text: `ID: ${channel.id}` },
                    };
                    const buttons = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('close')
                                .setLabel('Close')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('delete')
                                .setLabel('Delete')
                                .setStyle('DANGER'),
                            new MessageButton()
                                .setURL('https://xnorm.cloud')
                                .setLabel('Website')
                                .setStyle('LINK'),
                        );
                    channel.send({ embeds: [embed], components: [buttons] });
                });
            });
            message.reply(`Channel successfully created in \`${category.name}\` category!`);
        }
        else {
            message.reply(`Already existing channel in \`${category.name}\` category!`);
        }
    }
    else {
        message.reply(`\`${type}\` category doesn't exists!`);
    }
};

function exists(category, customer, message) {
    return message.guild.channels.cache.filter(channel => channel.name === customer && channel.parentId === category.id).size !== 0;
}
