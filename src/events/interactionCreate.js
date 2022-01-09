const config = require('../config/config.json');

module.exports = {
    name: "interactionCreate",
    once: false,
    async run(interaction) {

        // interaction commands
        if (interaction.isCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);
            // exits if no existing commands
            if (!command) return console.log(`\x1b[31m%s\x1b[0m`, `[ERROR] No existing commands :(`);

            // tries to execute the specific command
            try {

                // executes the command
                await command.execute(interaction);

                // log channel stuff
                if (config.log) {
                    
                    const avatar = interaction.member.user.displayAvatarURL({ size: 4096, dynamic: true });
                    const logchannel = interaction.member.guild.channels.cache.get(config.channels.log);

                    const embed = {
                        color: config.colors.blue,
                        author: { name: 'Command Used', icon_url: avatar },
                        description: `<@${interaction.user.id}>\n${interaction.user.tag}`,
                        fields: [ { name: 'Command', value: interaction.commandName } ],
                        timestamp: new Date(),
                        footer: { text: `ID: ${interaction.user.id}` },
                    };
                    logchannel.send({ embeds: [embed] });

                };

            } catch (error) {
                console.log(error);

                await interaction.reply({
                    content: config.interactions.error,
                    ephemeral: true,
                });
            };

        };

    },
};
