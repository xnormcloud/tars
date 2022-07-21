const config = require('../../config.json');
const { client, logChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord.js');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    run: member => {
        // log
        const embed = {
            color: config.colors.red,
            author: { name: 'Member Left', icon_url: findAvatar(client.user) },
            description: `<@${member.id}>\n${member.user.tag}`,
            thumbnail: { url: findAvatar(member.user) },
            timestamp: new Date(),
            footer: { text: `ID: ${member.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
