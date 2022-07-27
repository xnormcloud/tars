const bcrypt = require('bcrypt');
const hashSalt = process.env.HASH_SALT;

module.exports = {

    convert: message => {
        return bcrypt.hashSync(message, hashSalt).replace(/[^a-z\d]/g, '');
    },

    same: (hashMessage, message) => {
        return hashMessage === module.exports.convert(message);
    },

};
