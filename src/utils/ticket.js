const config = require('../config/config.json');

module.exports.create = (type, customer, message) => {
    const category = config.categories.filter(group => group.name === type)[0];
    if (category !== undefined) {
        if (!exists(category, customer, message)) {
            message.guild.channels.create(customer).then(channel => channel.setParent(category.id));
            message.reply(`Channel successfully created in \`${category.name}\` category!`);
        }
        else {
            message.reply(`Already existing channel in \`${category.name}\` category!`);
        }
    }
    else {
        message.reply(`\`${type}\` category doesn't exists!`);
    }
};

function exists(category, customer, message) {
    return message.guild.channels.cache.filter(channel => channel.name === customer && channel.parentId === category.id).size !== 0;
}
