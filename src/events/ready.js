// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
const config = require('../../config.json');
const colors = require('../constants/colors.js');
const { findAvatar, findChannel } = require('../utils/discordnt.js');

module.exports = {
    name: 'ready',
    once: true,
    run: async client => {
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
                        Routes.applicationGuildCommands(client.user.id, config.guild),
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
        console.log(colors.console.orangeReset, `[bot] ${client.user.username} ready!`);
        const embed = {
            color: colors.embed.blue,
            author: { name: `✅ ${client.user.username} ON!`, icon_url: findAvatar(client.user) },
            description: '[xnorm-cloud](https://xnorm.cloud)',
            timestamp: new Date(),
            footer: { text: `ID: ${client.user.id}` },
        };
        const logChannel = findChannel(client, config.channels.log);
        logChannel.send({ embeds: [embed] });
    },
};
