const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config/config.json');

module.exports = {
    name: "ready",
    once: true,
    run(client, commands) {

        // rest stuff
        const rest = new REST({
            version: "9",
        }).setToken(config.token);

        // register slash commands
        (async () => {
            try {
                // dev mode
                if (config.dev) {
                    await rest.put(
                        Routes.applicationCommands(client.user.id),
                        {
                            body: commands,
                        },
                    );
                    console.log(`\x1b[32m%s\x1b[0m`, '[slashCommands] registered locally successfully');
                }
                // discord server mode
                else {
                    await rest.put(
                        Routes.applicationGuildCommands(client.user.id, config.guildid),
                        {
                            body: commands,
                        },
                    );
                    console.log(`\x1b[32m%s\x1b[0m`, '[slashCommands] registered globally successfully');
                };
            } catch (error) {
                console.error(error);
            };
        })();

        // log channel stuff
        if (config.log) {

            const avatar = client.user.displayAvatarURL({ size: 4096, dynamic: true });
            const logchannel = client.channels.cache.find(channel => channel.id === config.channels.log);

            const embed = {
                color: '#1AA4E9',
                author: { name: `☑️ ${client.user.username} ON!`, icon_url: avatar },
                description: config.phrases[Math.floor(Math.random() * (config.phrases.length + 1))],
                timestamp: new Date(),
                footer: { text: `ID: ${client.user.id}` },
            };
            logchannel.send({ embeds: [embed] });

        };

        console.log(`\x1b[36m%s\x1b[0m`, `${client.user.username} ready!`);

    },
};
