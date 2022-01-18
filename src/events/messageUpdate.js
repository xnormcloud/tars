const config = require('../config/config.json');

module.exports = {
    name: 'messageUpdate',
    once: false,
    run(oldMessage, newMessage) {
        // checks if it's a content change
        if (newMessage.content != oldMessage.content) {
            // log
            const avatar = newMessage.author.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = newMessage.guild.channels.cache.get(config.channels.log);
            const embed = {
                color: config.colors.orange,
                author: { name: 'Message Edited', icon_url: avatar },
                description: `<@${newMessage.author.id}>\n${newMessage.author.tag}`,
                fields: [
                    { name: 'New Message', value: newMessage.content },
                    { name: 'Old Message', value: oldMessage.content },
                ],
                timestamp: new Date(),
                footer: { text: `ID: ${newMessage.author.id}` }
            };
            logchannel.send({ embeds: [embed] });
        };
    }
};
