const config = require('../config/config.json');

module.exports.create = (type, customer, message) => {
    const category = config.categories.map(group => group === type);
    console.log(category);
    if (category !== undefined) {
        if (!exists(category, customer, message)) {
            message.guild.channels.create(customer).then(channel => channel.setParent(category));
            message.reply('Channel successfully created!');
        }
        else {
            message.reply('Already existing channel!');
        }
    }
    else {
        message.reply('That category does not exists');
    }
};

function exists(category, customer, message) {
    return message.guild.channels.cache.filter(channel => channel.name === customer && channel.parentId === category).size !== 0;
}
