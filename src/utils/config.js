const fs = require('fs');
const path = require('path');
const dirname = path.resolve();

const checkConfig = (filePath, defaultFilePath) => {
    if (!fs.existsSync(filePath)) {
        fs.copyFileSync(defaultFilePath, filePath);
    }
};

module.exports = {

    generateConfig: () => {
        checkConfig(`${dirname}/.env`, `${dirname}/src/config/.env`);
        checkConfig(`${dirname}/config.json`, `${dirname}/src/config/config.json`);
    },

};
