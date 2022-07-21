const { findFiles } = require('../utils/internal.js');
const { client } = require('../constants/discord.js');

module.exports = {

    start: () => {
        const eventFiles = findFiles('/src/events');
        eventFiles.forEach(eventFile => {
            const event = require(`../events/${eventFile}`);
            if (!event.name) return; // avoid empty event files
            // client.once
            if (event.once && event.name !== 'ready') {
                client.once(event.name, (...args) => event.run(...args));
                console.log('\x1b[34m%s\x1b[0m', `[events] client.once(${event.name}) loaded`);
            }
            // client.on
            else if (!event.once) {
                if (event.name === 'messageCreate') {
                    client.on(event.name, (...args) => event.run(client.commands, ...args));
                }
                else {
                    client.on(event.name, (...args) => event.run(...args));
                }
                console.log('\x1b[34m%s\x1b[0m', `[events] client.on(${event.name}) loaded`);
            }
        });
    },

};
