// eslint-disable-next-line no-unused-vars
const config = require('../config/config.json');

module.exports = {
    name: 'customer',
    description: 'module for modifying customers model',
    permission: ['ADMINISTRATOR'],
    subcommands: [
        { name: 'add', description: 'adds new customer', parameters: ['customerid', 'invoiceday'] },
        { name: 'remove', description: 'removes existing customer', parameters: ['customerid'] },
        { name: 'get', description: 'gets existing customer', parameters: ['customerid'] },
        { name: 'modify', description: 'modify existing customer', parameters: ['customerid'] },
    ],
    run(message, args) {
        try {
            // add customer
            if (args[0] === 'add') {
                message.reply('add');
                // get customer
            }
            else if (args[0] === 'get') {
                /*
                const customerFound = await Customer.findOne().where('users').in(args[1])
                    .then(result => {
                        if (result) {
                            req.userType = 1
                            return;
                        }
                    });
                message.reply(customerFound);
                */
                message.reply('get');
                // remove customer
            }
            else if (args[0] === 'remove') {
                message.reply('remove');
            }
        }
        catch (e) {
            console.log(e.stack);
        }
    },
};
