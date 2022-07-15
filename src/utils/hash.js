const bcrypt = require('bcrypt');
require('dotenv').config();
const hashSalt = process.env.HASH_SALT;

module.exports = {

    convert,

    same: (hashMessage, message) => {
        return hashMessage === convert(message);
    },

};

function convert(message) {
    return bcrypt.hashSync(message, hashSalt).replace(/[^a-z\d]/g, '');
}
