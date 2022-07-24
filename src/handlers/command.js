const colors = require('../constants/colors.js');
const { findFiles } = require('../utils/internal.js');
const { client } = require('../constants/discord.js');

module.exports = {

    start: () => {
        const commandFiles = findFiles('/src/commands');
        commandFiles.forEach(commandFile => {
            const command = require(`../commands/${commandFile}`);
            if (!command.name) return; // avoid empty command files
            client.commands.set(command.name, command);
            console.log(colors.console.magentaReset, `[commands] ${command.name} loaded`);
        });
    },

};
