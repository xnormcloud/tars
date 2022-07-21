const config = require('../../config.json');
const { client, logChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord');

module.exports = {
    name: 'messageUpdate',
    once: false,
    run: (oldMessage, newMessage) => {
        // prevents crashing if message content is empty
        if (oldMessage.content === '' || newMessage.content === '') return;
        // checks if it's a content change
        if (newMessage.content !== oldMessage.content) {
            // log
            const embed = {
                color: config.colors.orange,
                author: { name: 'Message Edited', icon_url: findAvatar(client.user) },
                description: `<@${newMessage.author.id}>\n${newMessage.author.tag}`,
                thumbnail: { url: findAvatar(newMessage.author) },
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
