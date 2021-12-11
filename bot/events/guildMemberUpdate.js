const { MessageEmbed } = require('discord.js');
const config = require('../config/config.json');

module.exports = {
    name: "guildMemberUpdate",
    once: false,
    run(oldMember, newMember) {

        const logchannel = newMember.guild.channels.cache.get(config.channels.log);
        const avatar = newMember.user.displayAvatarURL({ size: 4096, dynamic: true });

        // role changed
        if (oldMember._roles.length != newMember._roles.length) {

            // role added
            if (newMember._roles.length > oldMember._roles.length) {

                // log channel stuffF
                const embed = new MessageEmbed()
                    .setColor('#1CD57F')
                    .setThumbnail(avatar)
                    .setAuthor('Role Added', avatar)
                    .setDescription(`<@${newMember.id}>\n${newMember.user.tag}`)
                    .setFooter(`ID: ${newMember.id}`)
                    .setTimestamp()

                for (var cont = 0; cont < newMember._roles.length; cont++) {
                    // searches the role checking inside oldMembers, newMember roles, finding the one it's only in newMember
                    if (!oldMember._roles.some(role => newMember._roles[cont].includes(role)))
                        embed.addField('Role', `<@&${newMember._roles[cont]}>`)
                };

                logchannel.send({ embeds: [embed] });

            }
            // role deleted
            else if (newMember._roles.length < oldMember._roles.length) {

                // log channel stuff
                const embed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setThumbnail(avatar)
                    .setAuthor('Role Removed', avatar)
                    .setDescription(`<@${newMember.id}>\n${newMember.user.tag}`)
                    .setFooter(`ID: ${newMember.id}`)
                    .setTimestamp()

                for (var cont = 0; cont < oldMember._roles.length; cont++) {
                    // searches the role checking inside newMember, oldMember roles, finding the one it's only in oldMember
                    if (!newMember._roles.some(role => oldMember._roles[cont].includes(role)))
                        embed.addField('Role', `<@&${oldMember._roles[cont]}>`)
                };

                logchannel.send({ embeds: [embed] });

            };

        }
        // nickname changed
        else if (newMember.nickname != oldMember.nickname) {

            // log channel stuff
            const embed = new MessageEmbed()
                .setColor('#FFA500')
                .setThumbnail(avatar)
                .setAuthor('Nickname Changed', avatar)
                .setDescription(`<@${newMember.id}>\n${newMember.user.tag}`)
                .setFooter(`ID: ${newMember.id}`)
                .setTimestamp()

            // checks if it's a nickname
            if (newMember.nickname)
                embed.addField('New Nickname', newMember.nickname);
            // no nickname so username instead
            else
                embed.addField('New Nickname', newMember.user.username);

            // same here but with oldMember
            if (oldMember.nickname)
                embed.addField('Old Nickname', oldMember.nickname);
            else
                embed.addField('Old Nickname', oldMember.user.username);

            logchannel.send({ embeds: [embed] });

        };

    },
};
