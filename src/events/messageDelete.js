const config = require('../../config.json');

module.exports = {
    name: 'messageDelete',
    once: false,
    run: (logChannel, message) => {
        // prevents crashing if message content is empty
        if (message.content === '') return;
        // log
        const avatar = message.author.displayAvatarURL({ size: 4096, dynamic: true });
        const embed = {
            color: config.colors.red,
            author: { name: 'Message Deleted', icon_url: avatar },
            description: `<@${message.author.id}>\n${message.author.tag}`,
            fields: [
                { name: 'Message', value: message.content },
                { name: 'Channel', value: `<#${message.channel.id}>` },
            ],
            timestamp: new Date(),
            footer: { text: `ID: ${message.author.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
