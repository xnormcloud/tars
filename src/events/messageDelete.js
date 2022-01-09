const { MessageEmbed } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: "messageDelete",
    once: false,
    run(message) {

        // log channel stuff
        if (config.log) {

            const avatar = message.author.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = message.guild.channels.cache.get(config.channels.log);

            const embed = new MessageEmbed()
                .setColor('#FF0000')
                .setThumbnail(avatar)
                .setAuthor('Message Deleted', avatar)
                .setDescription(`<@${message.author.id}>\n${message.author.tag}`)
                .addField('Message', message.content)
                .addField('Channel', `<#${message.channel.id}>`)
                .setFooter(`ID: ${message.author.id}`)
                .setTimestamp()
            logchannel.send({ embeds: [embed] });

        };

    },
};
