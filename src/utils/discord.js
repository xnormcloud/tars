const { guild } = require('../constants/discord.js');

module.exports = {

    findChannel: channelId => {
        return guild.channels.cache.find(channel => channel.id === channelId);
    },

    findMember: memberId => {
        return guild.members.cache.find(member => member.id === memberId);
    },

    findAvatar: user => {
        return user.displayAvatarURL({ size: 4096, dynamic: true });
    },

};
