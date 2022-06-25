// eslint-disable-next-line no-unused-vars
const config = require('../config/config.json');
const ticket = require('../utils/ticket.js');

module.exports = {
    name: 'ticket',
    description: 'ticket command',
    permission: ['ADMINISTRATOR'],
    subcommands: [
        { name: 'open', description: 'opens new ticket', parameters: ['type', 'customerid'] },
        { name: 'close', description: 'closes opened ticket', parameters: ['type', 'customerid'] },
    ],
    run(guild, message, args) {
        switch (args[0]) {
        case 'open':
            ticket.open(guild, message, args[1], args[2]);
            break;
        case 'close':
            ticket.close(guild, message, args[1], args[2]);
            break;
        default:
            message.reply('Unknown subcommand provided');
            break;
        }
    },
};
