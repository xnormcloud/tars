const config = require('../../config.json');
const notion = require('../database/notion.js');
const ticket = require('../systems/ticket.js');
const { capitalize } = require('../utils/string');

const isValidUser = async (member, ticketInfoCustomer) => {
    if (ticketInfoCustomer) return await notion.userTypeById(member.id);
    return true;
};

const isAdmin = (member, interaction) => {
    if (!member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({
            content: 'You don\'t have permission to use this button.',
            ephemeral: true,
        });
        return false;
    }
    return true;
};

module.exports = {
    name: 'interactionCreate',
    once: false,
    run: async (logChannel, interaction) => {
        /* slash commands
        // interaction commands
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            // exits if no existing commands
            if (!command) return console.log(`\x1b[31m%s\x1b[0m`, `[ERROR] No existing commands :(`);
            // tries to execute the specific command
            try {
                if (command.permissions && command.permissions.length > 0) {
                    if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: `You don't have permission to use this command.` })
                }
                // executes the command
                await command.execute(interaction);
                // log
                const avatar = interaction.member.user.displayAvatarURL({ size: 4096, dynamic: true });
                const embed = {
                    color: config.colors.blue,
                    author: { name: 'Command Used', icon_url: avatar },
                    description: `<@${interaction.user.id}>\n${interaction.user.tag}`,
                    fields: [ { name: 'Command', value: interaction.commandName } ],
                    timestamp: new Date(),
                    footer: { text: `ID: ${interaction.user.id}` },
                };
                logChannel.send({ embeds: [embed] });
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: config.interactions.error,
                    ephemeral: true,
                });
            };
        };
        */
        // tickets
        if (!interaction.isButton()) return;
        const { customId, channel, member } = interaction;
        const openTicketInteractionList = ticket.getOpenInteractionList();
        // open ticket from discord
        if (openTicketInteractionList.some(openTicketInteraction => openTicketInteraction.id === customId)) {
            await interaction.deferReply({ ephemeral: true });
            const ticketInfo = openTicketInteractionList.find(openTicketInteraction => openTicketInteraction.id === customId);
            // TODO: reduce number of notion database calls to improve speed :)
            // if not valid user for specified ticket return
            if (!await isValidUser(member, ticketInfo.customer)) return interaction.editReply(`${capitalize(ticketInfo.name)} ticket only available for customers`);
            const groups = await notion.getGroupsByUserId(member.id);
            // open ticket for not customer
            if (groups.length === 0) {
                await ticket.open(ticketInfo.name, member.id, interaction, null);
            }
            // open ticket for customer
            else {
                await ticket.open(ticketInfo.name, groups[0].id, interaction, null);
            }
        }
        // inside ticket buttons
        else if (isAdmin(member, interaction)) {
            await interaction.deferReply();
            const ticketInfoName = config.tickets.find(ticketSearch => ticketSearch.category === channel.parent.id).name;
            const channelName = channel.name;
            switch (customId) {
            case 'save_close_ticket':
                await ticket.close(ticketInfoName, channelName, interaction, null);
                break;
            case 'lock_ticket':
                await ticket.alternateLock(ticketInfoName, channelName, true, interaction, null);
                break;
            case 'unlock_ticket':
                await ticket.alternateLock(ticketInfoName, channelName, false, interaction, null);
                break;
            }
        }
    },
};
