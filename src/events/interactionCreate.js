const config = require('../../config.json');
const notion = require('../database/notion.js');
const ticket = require('../utils/ticket.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async run(logChannel, interaction) {
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
        const { guild, customId, channel, member } = interaction;
        const openTicketInteractionList = ticket.getOpenInteractionList();
        if (openTicketInteractionList.some(openTicketInteraction => openTicketInteraction.id === customId)) {
            await interaction.deferReply({
                ephemeral: true,
            });
            const ticketType = openTicketInteractionList.find(openTicketInteraction => openTicketInteraction.id === customId).name;
            const groups = await notion.getGroupsByUserId(member.id);
            await ticket.open(guild, ticketType, groups[0].id, interaction, null);
        }
        else if (isAdmin(member, interaction)) {
            await interaction.deferReply();
            switch (customId) {
            case 'save_close_ticket':
                await ticket.close(guild, getTicketInfo(channel).name, channel.name, interaction, null);
                break;
            case 'lock_ticket':
                await ticket.alternateLock(guild, getTicketInfo(channel).name, channel.name, true, interaction, null);
                break;
            case 'unlock_ticket':
                await ticket.alternateLock(guild, getTicketInfo(channel).name, channel.name, false, interaction, null);
                break;
            }
        }
    },
};

function isAdmin(member, interaction) {
    if (!member.permissions.has('ADMINISTRATOR')) {
        interaction.reply({
            content: 'You don\'t have permission to use this button.',
            ephemeral: true,
        });
        return false;
    }
    return true;
}

function getTicketInfo(channel) {
    return config.tickets.find(ticketSearch => ticketSearch.category === channel.parent.id);
}
