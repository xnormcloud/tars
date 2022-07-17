const config = require('../../config.json');

module.exports = {
    name: 'messageUpdate',
    once: false,
    run: (logChannel, oldMessage, newMessage) => {
        // prevents crashing if message content is empty
        if (oldMessage.content === '' || newMessage.content === '') return;
        // checks if it's a content change
        if (newMessage.content !== oldMessage.content) {
            // log
            const avatar = newMessage.author.displayAvatarURL({ size: 4096, dynamic: true });
            const embed = {
                color: config.colors.orange,
                author: { name: 'Message Edited', icon_url: avatar },
                description: `<@${newMessage.author.id}>\n${newMessage.author.tag}`,
                fields: [
                    { name: 'New Message', value: newMessage.content },
                    { name: 'Old Message', value: oldMessage.content },
                ],
                timestamp: new Date(),
                footer: { text: `ID: ${newMessage.author.id}` },
            };
            logChannel.send({ embeds: [embed] });
        }
    },
};
