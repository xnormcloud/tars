module.exports = {

    isValidRequest: (body, property) => {
        const keys = Object.keys(body);
        return keys.length > 0 && keys.includes(property);
    },

};
