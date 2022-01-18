const config = require('../config/config.json');

module.exports = {
    name: 'messageCreate',
    once: false,
    run(commands, message) {
        // not a command
        if (!message.content.startsWith(config.prefix)) return;
        // command ->
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let command = commands.get(cmd.slice(config.prefix.length))
        if(command) {
            try {
                if (command.name === 'help')
                    command.run(message, commands);
                else
                    command.run(message, args);
            } catch(e) {
                console.log(`[ERROR] Command ${command} not found`);
                console.log(e.stack);
            };
        };
    }
};
