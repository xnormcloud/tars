const config = require('../config/config.json');

module.exports = {
    name: "interactionCreate",
    once: "true",
    async run(interaction) {
        if (!interaction.isCommand()) return; // avoid not interactions stuff
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return; // avoid not existing commands

        // executes the specific command
        try {
            await command.execute(interaction);
            console.log(`\x1b[35m%s\x1b[0m`, `[interactions] ${interaction.user.username} used ${interaction.commandName} command!`);
        } catch (error) {
            console.log(error);

            await interaction.reply({
                content: config.interactions.error,
                ephemeral: true,
            });
        };

    },
};
