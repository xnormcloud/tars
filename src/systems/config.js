const fs = require('fs');
const path = require('path');
const dirname = path.resolve();

const checkConfig = (filePath, templateFilePath) => {
    if (!fs.existsSync(filePath)) {
        fs.copyFileSync(templateFilePath, filePath);
        return true;
    }
    return false;
};

module.exports = {

    generateConfig: () => {
        const generatedEnv = checkConfig(`${dirname}/.env`, `${dirname}/src/config/.env`);
        const generatedConfig = checkConfig(`${dirname}/config.json`, `${dirname}/src/config/config.json`);
        return generatedEnv || generatedConfig;
    },

};
