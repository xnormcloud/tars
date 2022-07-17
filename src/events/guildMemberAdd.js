const config = require('../../config.json');

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    run: (logChannel, member) => {
        // join
        const joinChannel = member.guild.channels.cache.get(config.channels.join);
        joinChannel.send(`👋🏻 Welcome to the server <@${member.id}>!`);
        // log & gets account creation date
        const date = new Date(member.user.createdTimestamp).toString();
        const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });
        const embed = {
            color: config.colors.green,
            author: { name: 'Member Joined', icon_url: avatar },
            description: `<@${member.id}>\n${member.user.tag}`,
            thumbnail: { url: avatar },
            fields: [ { name: 'Account Creation Date', value: date.substring(0, date.length - 39) } ],
            timestamp: new Date(),
            footer: { text: `ID: ${member.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
