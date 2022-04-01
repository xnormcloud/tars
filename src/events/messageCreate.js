const config = require('../config/config.json');

function runCommand(commands, command, message, args) {
    if (command.name === 'help') {
        command.run(message, commands);
    }
    else {
        command.run(message, args);
    }
}

module.exports = {
    name: 'messageCreate',
    once: false,
    run(commands, message) {
        // not a command
        if (!message.content.startsWith(config.prefix)) return;
        // command ->
        const messageArray = message.content.split(' ');
        const cmd = messageArray[0];
        const args = messageArray.slice(1);
        const command = commands.get(cmd.slice(config.prefix.length));
        if (command) {
            try {
                if (command.permission != null) {
                    if (message.member.permissions.has(command.permission || [])) {
                        runCommand(commands, command, message, args);
                    }
                    else {
                        message.reply('You don\'t have permission to execute this command!');
                    }
                }
                else {
                    runCommand(commands, command, message, args);
                }
            }
            catch (e) {
                console.log(e.stack);
            }
        }
    },
};
