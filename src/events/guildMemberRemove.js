const config = require('../config/config.json');

module.exports = {
    name: "guildMemberRemove",
    once: false,
    run(member) {

        // log channel stuff
        if (config.log) {

            const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = member.guild.channels.cache.get(config.channels.log);

            const embed = {
                color: '#FF0000',
                author: { name: 'Member Left', icon_url: avatar },
                description: `<@${member.id}>\n${member.user.tag}`,
                thumbnail: { url: avatar },
                timestamp: new Date(),
                footer: { text: `ID: ${member.id}` },
            };
            logchannel.send({ embeds: [embed] });

        };

    },
};
