// eslint-disable-next-line no-unused-vars
const config = require('../config/config.json');
const ticket = require('../utils/ticket.js');

module.exports = {
    name: 'ticket',
    description: 'ticket command',
    permission: ['ADMINISTRATOR'],
    subcommands: [
        { name: 'create', description: 'creates new ticket', parameters: ['type', 'customerid'] },
    ],
    run(message, args) {
        try {
            if (args[0] === 'create') {
                ticket.create(args[1], args[2], message);
            }
        }
        catch (e) {
            console.log(e.stack);
        }
    },
};
