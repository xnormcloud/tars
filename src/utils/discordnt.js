module.exports = {

    findAvatar: user => {
        return user.displayAvatarURL({ size: 4096, dynamic: true });
    },

    findChannel: (client, channelId) => {
        return client.channels.cache.find(channel => channel.id === channelId);
    },

};
