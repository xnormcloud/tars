const fs = require('fs');
const { dirname } = require('../constants/general.js');
const { client } = require('../constants/discord.js');

module.exports = {

    start: () => {
        const commandFiles = fs.readdirSync(`${dirname}/src/commands`).filter(file => file.endsWith('.js'));
        commandFiles.forEach(commandFile => {
            const command = require(`../commands/${commandFile}`);
            if (!command.name) return; // avoid empty command files
            client.commands.set(command.name, command);
            console.log('\x1b[32m%s\x1b[0m', `[commands] ${command.name} loaded`);
        });
    },

};
