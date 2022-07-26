const config = require('../../config.json');
const { findAvatar, findChannel } = require('../utils/discordnt.js');

const findGuild = guildId => {
    return module.exports.client.guilds.cache.get(guildId);
};

module.exports = {

    initDiscordConstants: clientEntry => {
        module.exports.client = clientEntry;
        module.exports.guild = findGuild(config.guild);
        module.exports.clientAvatar = findAvatar(clientEntry.user);
        module.exports.joinChannel = findChannel(clientEntry, config.channels.join);
        module.exports.ticketChannel = findChannel(clientEntry, config.channels.ticket);
        module.exports.logChannel = findChannel(clientEntry, config.channels.log);
        module.exports.errorChannel = findChannel(clientEntry, config.channels.error);
    },

    client: null,
    guild: null,
    clientAvatar: null,
    joinChannel: null,
    ticketChannel: null,
    logChannel: null,
    errorChannel: null,

    presence: {
        activities: {
            type: [
                'PLAYING',
                'STREAMING',
                'LISTENING',
                'WATCHING',
            ],
        },
        status: [
            'online',
            'idle',
            'dnd',
            'offline',
        ],
    },

};
