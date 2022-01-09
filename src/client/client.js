const { Client, Collection } = require('discord.js');
const fs = require('fs');
const config = require('../config/config.json');

const path = require('path');
const ___dirname = path.resolve();

class ExtendedClient extends Client {

	constructor() {

		super({

			// https://ziad87.net/intents
			intents: 32767,
			disableEveryone: true,
			// presence stuff
			presence: {
				activities: [{
					name: config.presence.activites.name,
					type: config.presence.activites.type[3], // [0]PLAYING, [1]STREAMING, [2]LISTENING, [3]WATCHING
					url: config.url.twitch
				}],
				status: config.presence.status[2], // [0]online, [1]idle, [2]dnd, [3]offline
			},
		});
		// creates commands collection
		this.commands = new Collection();

	};

	run() {

		this.registerModules();
		this.login(config.token);

	};

	async registerModules() {

		// commands register
		const commandFiles = fs.readdirSync(`${___dirname}/src/commands`)
			.filter(file => file.endsWith(".js"));
		const commands = [];

		// commands loader
		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			commands.push(command.data.toJSON());
			if (!command.data.name) return; // avoid empty command files
			this.commands.set(command.data.name, command);
			console.log(`\x1b[32m%s\x1b[0m`, `[commands] ${command.data.name} loaded!`);
		};

		// commands debug
		console.log('commandFiles:', commandFiles);
		console.log('commands:', commands);
		console.log('loadedcommands:', this.commands);

		// events register
		const eventFiles = fs.readdirSync(`${___dirname}/src/events`)
			.filter(file => file.endsWith(".js"));
		const events = eventFiles.map(file => require(`../events/${file}`));

		// events loader
		events.forEach(event => {
			if (!event.name) return; // avoid empty event files
			// client.once
			if (event.once) {
				this.once(event.name, (...args) => event.run(...args, commands));
				console.log(`\x1b[34m%s\x1b[0m`, `[events] client.once(${event.name}) loaded!`);
			}
			// client.on
			else {
				this.on(event.name, (...args) => event.run(...args));
				console.log(`\x1b[34m%s\x1b[0m`, `[events] client.on(${event.name}) loaded!`);
			};
		});

		// events debug
		console.log('eventFiles:', eventFiles);
		console.log('events:', events);

	};

};

module.exports = ExtendedClient;
