const fs = require('fs');
const path = require('path');
const dirname = path.resolve();

module.exports = {

    findFiles: dir => {
        return fs.readdirSync(`${dirname}/${dir}`).filter(file => file.endsWith('.js'));
    },

};
