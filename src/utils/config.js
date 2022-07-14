const fs = require('fs');
const path = require('path');
const dirname = path.resolve();

module.exports = {

    generateConfig: function() {
        checkConfig(`${dirname}/.env`, `${dirname}/src/config/.env`);
        checkConfig(`${dirname}/config.json`, `${dirname}/src/config/config.json`);
    },

};

function checkConfig(filePath, defaultFilePath) {
    if (!fs.existsSync(filePath)) {
        fs.copyFileSync(defaultFilePath, filePath);
    }
}
