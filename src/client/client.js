const { Client, Collection } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');
require('dotenv').config();
const discordBotToken = process.env.DISCORD_BOT_TOKEN;
const discordConstants = require('../constants/discord.js');
const restApi = require('./restApi.js');

const path = require('path');
const dirname = path.resolve();

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
        // commands register
        const commandFiles = fs.readdirSync(`${dirname}/src/commands`).filter(file => file.endsWith('.js'));
        // commands loader
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            if (!command.name) return; // avoid empty command files
            this.commands.set(command.name, command);
            console.log('\x1b[32m%s\x1b[0m', `[commands] ${command.name} loaded`);
        }
        // events register
        const eventFiles = fs.readdirSync(`${dirname}/src/events`).filter(file => file.endsWith('.js'));
        const events = eventFiles.map(file => require(`../events/${file}`));
        // events loader
        events.forEach(event => {
            if (!event.name) return; // avoid empty event files
            // client.once
            if (event.once && event.name !== 'ready') {
                this.once(event.name, (...args) => event.run(...args));
                console.log('\x1b[34m%s\x1b[0m', `[events] client.once(${event.name}) loaded`);
            }
            // client.on
            else if (!event.once) {
                if (event.name === 'messageCreate') {
                    this.on(event.name, (...args) => event.run(this.commands, ...args));
                }
                else {
                    this.on(event.name, (...args) => event.run(...args));
                }
                console.log('\x1b[34m%s\x1b[0m', `[events] client.on(${event.name}) loaded`);
            }
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
