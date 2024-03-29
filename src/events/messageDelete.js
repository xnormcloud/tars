const colors = require('../constants/colors.js');
const { clientAvatar, logChannel } = require('../constants/discord.js');
const { codeFormat } = require('../utils/string.js');

module.exports = {
    name: 'messageDelete',
    once: false,
    run: message => {
        // prevents crashing if message content is empty
        if (message.content === '') return;
        // log
        const embed = {
            color: colors.embed.red,
            author: { name: 'Message Deleted', icon_url: clientAvatar },
            description: `<@${message.author.id}>\n${message.author.tag}\n${codeFormat(message.content)}`,
            fields: [
                { name: 'Channel', value: `<#${message.channel.id}>` },
            ],
            timestamp: new Date(),
            footer: { text: `ID: ${message.author.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
