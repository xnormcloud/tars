const { MessageEmbed } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: "guildMemberRemove",
    once: false,
    run(member) {

        // log channel stuff
        if (config.log) {

            const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = member.guild.channels.cache.get(config.channels.log);

            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setThumbnail(avatar)
                .setAuthor('Member Left', avatar)
                .setDescription(`<@${member.id}>\n${member.user.tag}`)
                .setFooter(`ID: ${member.id}`)
                .setTimestamp()
            logchannel.send({ embeds: [embed] });

        };

    },
};
