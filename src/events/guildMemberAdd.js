const { MessageEmbed } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    run(member) {

        const joinchannel = member.guild.channels.cache.get(config.channels.join);

        // join channel stuff
        joinchannel.send(`👋🏻 Welcome to the server <@${member.id}>!`);

        // log channel stuff
        if (config.log) {

            // gets account creation date
            const date = new Date(member.user.createdTimestamp).toString();
            const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = member.guild.channels.cache.get(config.channels.log);

            const embed = {
                color: '#1CD57F',
                author: { name: 'Member Joined', icon_url: avatar },
                description: `<@${member.id}>\n${member.user.tag}`,
                thumbnail: { url: avatar },
                fields: [ { name: 'Account Creation Date', value: date.substring(0, date.length - 39) } ],
                timestamp: new Date(),
                footer: { text: `ID: ${member.id}` },
            };
            logchannel.send({ embeds: [embed] });

        };

    },
};
