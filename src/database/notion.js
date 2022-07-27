const colors = require('../constants/colors.js');
const requireFromUrl = require('require-from-url/sync');
const notionRemoteUrl = process.env.NOTION_REMOTE_URL;

module.exports = {

    updateDatabase: () => {
        const isInit = module.exports.database !== null;
        try {
            const notionUpdate = requireFromUrl(notionRemoteUrl);
            const isSame = notionUpdate === module.exports.database;
            if (!isSame) {
                module.exports.database = notionUpdate;
                if (isInit) {
                    console.log(colors.console.greenReset, '[notion] lib updated to last version succesfully!');
                }
                else {
                    console.log(colors.console.greenReset, '[notion] lib init succesfully!');
                }
            }
            return true;
        }
        catch (error) {
            if (isInit) {
                console.log(colors.console.orangeReset, '[notion] couln\'t update lib, keeping old version!');
                return true;
            }
            console.log(colors.console.redReset, '[notion] couln\'t init lib :(');
            return false;
        }
    },

    database: null,

};
