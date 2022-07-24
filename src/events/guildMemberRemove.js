const colors = require('../constants/colors.js');
const { client, logChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord.js');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    run: member => {
        // log
        const embed = {
            color: colors.embed.red,
            author: { name: 'Member Left', icon_url: findAvatar(client.user) },
            description: `<@${member.id}>\n${member.user.tag}`,
            thumbnail: { url: findAvatar(member.user) },
            timestamp: new Date(),
            footer: { text: `ID: ${member.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
