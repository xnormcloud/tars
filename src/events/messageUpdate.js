const { MessageEmbed } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: "messageUpdate",
    once: false,
    run(oldMessage, newMessage) {

        // checks if it's a content change
        if (newMessage.content != oldMessage.content) {

            // log channel stuff
            if (config.log) {

                const avatar = newMessage.author.displayAvatarURL({ size: 4096, dynamic: true });
                const logchannel = newMessage.guild.channels.cache.get(config.channels.log);

                const embed = new MessageEmbed()
                    .setColor('#FFA500')
                    .setThumbnail(avatar)
                    .setAuthor('Message Edited', avatar)
                    .setDescription(`<@${newMessage.author.id}>\n${newMessage.author.tag}`)
                    .addField('New Message', newMessage.content)
                    .addField('Old Message', oldMessage.content)
                    .addField('Channel', `<#${newMessage.channel.id}>`)
                    .setFooter(`ID: ${newMessage.author.id}`)
                    .setTimestamp()
                logchannel.send({ embeds: [embed] });

            };

        };

    },
};
