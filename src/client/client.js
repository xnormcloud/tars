const { Client, Collection } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');
require('dotenv').config();
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const { dirname } = require('../constants/general.js');
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
                    type: config.presence.activities.type[3], // [0]PLAYING, [1]STREAMING, [2]LISTENING, [3]WATCHING
                    url: config.url.twitch,
                }],
                status: config.presence.status[2], // [0]online, [1]idle, [2]dnd, [3]offline
            },
        });
        // create commands collection
        this.commands = new Collection();
    }

    run() {
        this.login(discordBotToken).then(() => console.log('\x1b[36m%s\x1b[0m', '[login] login step succeed'));
        // TODO: fix execute ready.js from here
        this.once('ready', () => this.registerModules().then(() => restApi.start()));
    }

    async registerModules() {
        // init discord constants
        discordConstants.initDiscordConstants(this);
        // handlers
        const handlerFiles = fs.readdirSync(`${dirname}/src/handlers`).filter(file => file.endsWith('.js'));
        handlerFiles.forEach(handlerFile => {
            const handler = require(`../handlers/${handlerFile}`);
            handler.start();
        });
        // ticket discord message init
        const ticket = require('../systems/ticket.js');
        await ticket.initDiscordMessage().then(() =>
            console.log('\x1b[36m%s\x1b[0m', '[ticket] discord message init succeed'),
        );
        console.log('\x1b[36m%s\x1b[0m', '[modules] everything loaded successfully');
    }

}

module.exports = ExtendedClient;
