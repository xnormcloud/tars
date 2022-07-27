const fs = require('fs');
const path = require('path');
const dirname = path.resolve();

module.exports = {

    findFiles: dir => {
        return fs.readdirSync(`${dirname}/${dir}`).filter(file => file.endsWith('.js'));
    },

    isArrayEmpty: array => {
        return array.length === 0;
    },

    isDiscordId: id => {
        return id.length === 18;
    },

    isNotionId: id => {
        return id.length === 32;
    },

};
