const { MessageEmbed } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async run(member) {

        const joinchannel = member.guild.channels.cache.get(config.channels.join);
        const logchannel = member.guild.channels.cache.get(config.channels.log);

        const avatar = member.user.displayAvatarURL({ size: 4096, dynamic: true });
        const date = new Date(member.user.createdTimestamp);
        var str = date.toString();

        // join channel stuff
        joinchannel.send(`👋🏻 Welcome to the server <@${member.id}>!`);

        // log channel stuff
        const embed = new MessageEmbed()
            .setColor('#1CD57F')
            .setThumbnail(avatar)
            .setAuthor('Member Joined', avatar)
            .setDescription(`<@${member.id}>\n${member.user.tag}`)
            .addField('Account Created', str.substring(0, str.length - 39))
            .setFooter(`ID: ${member.id}`)
            .setTimestamp()
        logchannel.send({ embeds: [embed] });

    },
};