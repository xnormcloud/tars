const config = require('../../config.json');

const findGuild = guildId => {
    return module.exports.client.guilds.cache.get(guildId);
};

const findAvatar = user => {
    return user.displayAvatarURL({ size: 4096, dynamic: true });
};

const findChannel = channelId => {
    return module.exports.guild.channels.cache.find(channel => channel.id === channelId);
};

module.exports = {

    initDiscordConstants: clientEntry => {
        module.exports.client = clientEntry;
        module.exports.guild = findGuild(config.guild);
        module.exports.clientAvatar = findAvatar(clientEntry.user);
        module.exports.joinChannel = findChannel(config.channels.join);
        module.exports.ticketChannel = findChannel(config.channels.ticket);
        module.exports.logChannel = findChannel(config.channels.log);
        module.exports.errorChannel = findChannel(config.channels.error);
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
