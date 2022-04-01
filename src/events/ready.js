// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
const config = require('../config/config.json');

module.exports = {
    name: 'ready',
    once: true,
    run(client) {
        /* slash commands register
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
        */
        // log
        console.log('\x1b[36m%s\x1b[0m', `${client.user.username} ready!`);
        const logchannel = client.channels.cache.find(channel => channel.id === config.channels.log);
        const embed = {
            color: config.colors.blue,
            author: { name: `☑️ ${client.user.username} ON!`, icon_url: client.user.displayAvatarURL({ size: 4096, dynamic: true }) },
            description: '[xnorm-cloud](https://xnorm.cloud)',
            timestamp: new Date(),
            footer: { text: `ID: ${client.user.id}` },
        };
        logchannel.send({ embeds: [embed] });
    },
};
