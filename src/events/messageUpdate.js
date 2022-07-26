const colors = require('../constants/colors.js');
const { clientAvatar, logChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord.js');
const { codeFormat } = require('../utils/string.js');

module.exports = {
    name: 'messageUpdate',
    once: false,
    run: (oldMessage, newMessage) => {
        // prevents crashing if message content is empty
        if (oldMessage.content === '' || newMessage.content === '') return;
        // prevents crashing if message is rly long
        if (oldMessage.content.size > 1024 || newMessage.content.size > 1024) return;
        // checks if it's a content change
        if (newMessage.content !== oldMessage.content) {
            // log
            const embed = {
                color: colors.embed.orange,
                author: { name: 'Message Edited', icon_url: clientAvatar },
                description: `<@${newMessage.author.id}>\n${newMessage.author.tag}`,
                thumbnail: { url: findAvatar(newMessage.author) },
                fields: [
                    { name: 'Old', value: codeFormat(oldMessage.content) },
                    { name: 'New', value: codeFormat(newMessage.content) },
                    { name: 'Channel', value: `<#${newMessage.channel.id}>` },
                ],
                timestamp: new Date(),
                footer: { text: `ID: ${newMessage.author.id}` },
            };
            if (embed.size >= 6000) return;
            logChannel.send({ embeds: [embed] });
        }
    },
};
