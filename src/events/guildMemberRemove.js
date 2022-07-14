const config = require('../../config.json');

module.exports = {
    name: 'guildMemberRemove',
    once: false,
    run(logChannel, member) {
        // log
        const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });
        const embed = {
            color: config.colors.red,
            author: { name: 'Member Left', icon_url: avatar },
            description: `<@${member.id}>\n${member.user.tag}`,
            thumbnail: { url: avatar },
            timestamp: new Date(),
            footer: { text: `ID: ${member.id}` },
        };
        logChannel.send({ embeds: [embed] });
    },
};
