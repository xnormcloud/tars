const { Client, Collection } = require('discord.js');
const config = require('../../config.json');
require('dotenv').config();
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const { findFiles } = require('../utils/internal.js');
const colors = require('../constants/colors.js');
const discordConstants = require('../constants/discord.js');
const restApi = require('./restApi.js');

class ExtendedClient extends Client {

    constructor() {
        super({
            // https://ziad87.net/intents
            intents: 32767,
            disableEveryone: true,
            // presence
            presence: {
                activities: [{
                    name: config.presence.activities.name,
                    type: discordConstants.presence.activities.type[config.presence.activities.type], // [0]PLAYING, [1]STREAMING, [2]LISTENING, [3]WATCHING
                    url: config.url.twitch,
                }],
                status: discordConstants.presence.status[config.presence.status], // [0]online, [1]idle, [2]dnd, [3]offline
            },
        });
        // create commands collection
        this.commands = new Collection();
    }

    run() {
        this.login(discordBotToken).then(() => console.log(colors.console.orangeReset, '[bot] login step succeed'));
        // TODO: fix execute ready.js from here
        this.once('ready', () => this.registerModules().then(() => restApi.start()));
    }

    async registerModules() {
        // init discord constants
        discordConstants.initDiscordConstants(this);
        // handlers
        const handlerFiles = findFiles('/src/handlers');
        handlerFiles.forEach(handlerFile => {
            const handler = require(`../handlers/${handlerFile}`);
            handler.start();
        });
        // ticket discord message init
        const { initDiscordMessage } = require('../systems/ticket.js');
        await initDiscordMessage().then(() =>
            console.log(colors.console.orangeReset, '[ticket] discord message init succeed'),
        );
        console.log(colors.console.greenReset, '[bot] everything loaded successfully');
    }

}

module.exports = ExtendedClient;
