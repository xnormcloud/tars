const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../config/config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clients')
		.setDescription('clients manager system')

		// show command
		.addSubcommand(subcommand => subcommand
			.setName('show')
			.setDescription('shows clients info')
			.addStringOption(option => option
				.setName('name')
				.setDescription('server name')
			)
		)

		// update command
		.addSubcommand(subcommand => subcommand
			.setName('update')
			.setDescription('updates clients info')
			.addStringOption(option => option
				.setName('name')
				.setDescription('server name')
			)
			.addStringOption(option => option
				.setName('invoicedateday')
				.setDescription('server invoice day 00')
			)
		)

		// add command
		.addSubcommand(subcommand => subcommand
			.setName('add')
			.setDescription('adds clients info')
			.addStringOption(option => option
				.setName('name')
				.setDescription('server name')
				.setRequired(true)
			)
			.addStringOption(option => option
				.setName('invoicedateday')
				.setDescription('server invoice day 00')
				.setRequired(true)
			)
		)

		// remove command
		.addSubcommand(subcommand => subcommand
			.setName('remove')
			.setDescription('removes clients info')
			.addStringOption(option => option
				.setName('name')
				.setDescription('server name')
				.setRequired(true)
			)
		),

	async execute(interaction) {
		
		// show command
		if (interaction.options.getSubCommand() === 'show') {

		} 
		// update command
		else if (interaction.options.getSubCommand() === 'update') {

		} 
		// add command
		else if (interaction.options.getSubCommand() === 'add') {

		} 
		// remove command
		else if (interaction.options.getSubCommand() === 'remove') {

		}	

		await interaction.reply('Select a option to do something');
		
	},
};