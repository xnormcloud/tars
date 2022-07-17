const config = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'command help',
    run: (message, commands) => {
        const embed = {
            color: config.colors.blue,
            thumbnail: { url: message.guild.members.cache.get(config.client).displayAvatarURL({ size: 4096, dynamic: true }) },
            fields: [],
            timestamp: new Date(),
            footer: { text: `ID: ${message.member.id}` },
        };
        // help type is going to display
        if (message.member.permissions.has(['ADMINISTRATOR'] || [])) {
            embed.author = { name: 'Administrator Commands Help' };
        }
        else {
            embed.author = { name: 'Commands Help' };
        }
        // command fields info
        let cont = 0;
        for (const [commandname] of commands) {
            if (commands.get(commandname).name !== 'help') {
                if (commands.get(commandname).permission != null) {
                    if (message.member.permissions.has(commands.get(commandname).permission || [])) {
                        if (commands.get(commandname).subcommands != null) {
                            let subcommands = '```';
                            // gets subcommands
                            commands.get(commandname).subcommands.forEach(subcommand => {
                                if (subcommand.parameters != null) {
                                    let parameters = '';
                                    // gets each subcommand parameter
                                    subcommand.parameters.forEach(parameter => {
                                        parameters += `[${parameter}] `;
                                    });
                                    subcommands += `\n- ${subcommand.name}: ${subcommand.description}\n${parameters}`;
                                }
                                else {
                                    subcommands += `\n- ${subcommand.name}: ${subcommand.description}`;
                                }
                            });
                            subcommands += '```';
                            embed.fields[cont] = { name: `.${commands.get(commandname).name}`, value: `${commands.get(commandname).description}\n${subcommands}` };
                        }
                        else {
                            embed.fields[cont] = { name: `.${commands.get(commandname).name}`, value: commands.get(commandname).description };
                        }
                    }
                }
                else {
                    embed.fields[cont] = { name: `.${commands.get(commandname).name}`, value: commands.get(commandname).description };
                }
                cont++;
            }
        }
        message.reply({ embeds: [embed] });
    },
};
