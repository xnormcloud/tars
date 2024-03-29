const { guild } = require('../constants/discord.js');
const { findAvatar } = require('./discordnt.js');

module.exports = {

    findAvatar,

    findChannel: channelId => {
        return guild.channels.cache.find(channel => channel.id === channelId);
    },

    findChannelByName: (categoryId, ChannelName) => {
        return guild.channels.cache.find(channel => channel.parentId === categoryId && channel.name === ChannelName);
    },

    findMember: memberId => {
        return guild.members.cache.find(member => member.id === memberId);
    },

    isChannel: channelId => {
        return guild.channels.cache.some(channel => channel.id === channelId);
    },

    isChannelByName: (categoryId, ChannelName) => {
        return guild.channels.cache.some(channel => channel.parentId === categoryId && channel.name === ChannelName);
    },

    isMember: memberId => {
        return guild.members.cache.some(member => member.id === memberId);
    },

    isAdmin: user => {
        if (user.permissions.has('ADMINISTRATOR')) return true;
        return false;
    },

    generateChannelUrl: channelId => {
        return `https://discord.com/channels/${guild.id}/${channelId}`;
    },

};
