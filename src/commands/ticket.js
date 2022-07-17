const ticket = require('../utils/ticket.js');

module.exports = {
    name: 'ticket',
    description: 'ticket command',
    permission: ['ADMINISTRATOR'],
    subcommands: [
        { name: 'open', description: 'opens new ticket', parameters: ['type', 'customerid'] },
        { name: 'close', description: 'closes opened ticket', parameters: ['type', 'customerid'] },
    ],
    run: async (guild, message, args) => {
        switch (args[0]) {
        case 'open':
            await ticket.open(args[1], args[2], null, message);
            break;
        case 'close':
            await ticket.close(args[1], args[2], null, message);
            break;
        case 'lock':
            await ticket.alternateLock(args[1], args[2], true, null, message);
            break;
        case 'unlock':
            await ticket.alternateLock(args[1], args[2], false, null, message);
            break;
        default:
            message.reply('Unknown subcommand provided');
            break;
        }
    },
};
