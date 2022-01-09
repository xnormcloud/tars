const config = require('../config/config.json');

module.exports = {
    name: "messageDelete",
    once: false,
    run(message) {

        // log channel stuff
        if (config.log) {

            const avatar = message.author.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = message.guild.channels.cache.get(config.channels.log);

            const embed = {
                color: '#FF0000',
                author: { name: 'Message Deleted', icon_url: avatar },
                description: `<@${message.author.id}>\n${message.author.tag}`,
                fields: [
                    { name: 'Message', value: message.content },
                    { name: 'Channel', value: `<#${message.channel.id}>` },
                ],
                timestamp: new Date(),
                footer: { text: `ID: ${message.author.id}` },
            };
            logchannel.send({ embeds: [embed] });

        };

    },
};
