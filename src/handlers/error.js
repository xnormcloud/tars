/* eslint-disable no-unused-vars */
const colors = require('../constants/colors.js');
const { client, errorChannel } = require('../constants/discord.js');
const { findAvatar } = require('../utils/discord.js');
const { codeFormat } = require('../utils/string.js');

const processError = (type, reason) => {
    console.log(reason);
    const errorEmbed = {
        color: colors.embed.red,
        author: { name: `⚠️ ${client.user.username} got an ${type} exception :(`, icon_url: findAvatar(client.user) },
        description: codeFormat(reason.stack),
        timestamp: new Date(),
        footer: { text: `ID: ${client.user.id}` },
    };
    errorChannel.send({ embeds: [errorEmbed] });
};

module.exports = {

    run: () => {
        process.on('unhandledRejection', (reason, p) => {
            processError('unhandledRejection', reason);
        });
        process.on('uncaughtException', (err, origin) => {
            processError('uncaughtException', err);
        });
        process.on('uncaughtExceptionMonitor', (err, origin) => {
            processError('uncaughtExceptionMonitor', err);
        });
        process.on('multipleResolves', (type, promise, reason) => {
            processError('multipleResolves', type, reason);
        });
    },

};
