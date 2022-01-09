const config = require('../config/config.json');

module.exports = {
    name: "guildMemberUpdate",
    once: false,
    run(oldMember, newMember) {

        // exits if log is disabled
        if (!config.log) return;

        const avatar = newMember.user.displayAvatarURL({ size: 4096, dynamic: true });
        const logchannel = newMember.guild.channels.cache.get(config.channels.log);

        // role changed
        if (oldMember._roles.length != newMember._roles.length) {

            // shared embed
            const embed = {
                description: `<@${newMember.id}>\n${newMember.user.tag}`,
                thumbnail: {
                    url: avatar,
                },
                timestamp: new Date(),
                footer: {
                    text: `ID: ${newMember.id}`,
                },
            };

            // role added
            if (newMember._roles.length > oldMember._roles.length) {

                // log channel stuff
                embed.color = { color: config.colors.green };
                embed.author = { name: 'Role Added', icon_url: avatar };

                for (var cont = 0; cont < newMember._roles.length; cont++) {
                    // searches the role checking inside oldMembers, newMember roles, finding the one it's only in newMember
                    if (!oldMember._roles.some(role => newMember._roles[cont].includes(role)))
                        embed.fields = [ { name: 'Role', value: `<@&${newMember._roles[cont]}>` } ];
                };

                logchannel.send({ embeds: [embed] });

            }
            // role deleted
            else if (newMember._roles.length < oldMember._roles.length) {

                // log channel stuff
                embed.color = { color: config.colors.red };
                embed.author = { name: 'Role Removed', icon_url: avatar };

                for (var cont = 0; cont < oldMember._roles.length; cont++) {
                    // searches the role checking inside newMember, oldMember roles, finding the one it's only in oldMember
                    if (!newMember._roles.some(role => oldMember._roles[cont].includes(role)))
                        embed.fields = [ { name: 'Role', value: `<@&${oldMember._roles[cont]}>` } ];
                };

                logchannel.send({ embeds: [embed] });

            };

        }
        // nickname changed
        else if (newMember.nickname != oldMember.nickname) {

            // log channel stuff
            const embed = {
                color: config.colors.orange,
                author: { name: 'Nickname Changed', icon_url: avatar },
                description: `<@${newMember.id}>\n${newMember.user.tag}`,
                thumbnail: { url: avatar },
                fields: [],
                timestamp: new Date(),
                footer: { text: `ID: ${newMember.id}` },
            };

            // checks if it's a nickname
            if (newMember.nickname)
                embed.fields[0] = { name: 'New Nickname', value: newMember.nickname };
            // no nickname so username instead
            else
                embed.fields[0] = { name: 'New Username', value: newMember.user.username };

            // same here but with oldMember
            if (oldMember.nickname)
                embed.fields[1] = { name: 'Old Nickname', value: oldMember.nickname };
            else
                embed.fields[1] = { name: 'Old Username', value: oldMember.user.username };

            logchannel.send({ embeds: [embed] });

        };

    },
};
