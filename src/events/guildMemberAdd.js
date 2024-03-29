const colors = require('../constants/colors.js');
const { clientAvatar, joinChannel, logChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord.js');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    run: member => {
        // join
        joinChannel.send(`👋🏻 Welcome to the server <@${member.id}>!`);
        // log & gets account creation date
        const date = new Date(member.user.createdTimestamp).toString();
        const embed = {
            color: colors.embed.green,
            author: { name: 'Member Joined', icon_url: clientAvatar },
            description: `<@${member.id}>\n${member.user.tag}`,
            thumbnail: { url: findAvatar(member.user) },
            fields: [ { name: 'Account Creation Date', value: date.substring(0, date.length - 39) } ],
            timestamp: new Date(),
            footer: { text: `ID: ${member.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
