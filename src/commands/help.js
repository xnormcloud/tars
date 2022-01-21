const config = require('../config/config.json');

module.exports = {
    name: 'help',
    description: 'command help',
    run(message, commands) {
        const embed = {
            color: config.colors.blue,
            thumbnail: { url: message.guild.members.cache.get(config.clientid).displayAvatarURL({ size: 4096, dynamic: true }) },
            fields: [],
            timestamp: new Date(),
            footer: { text: `ID: ${message.member.id}` }
        }
        // Type of help is going to display
        if (message.member.permissions.has(['ADMINISTRATOR'] || [])) {
            embed.author = { name: 'Administrator Commands Help' };
        } else {
            embed.author = { name: 'Commands Help' };
        }
        // commands fields info
        var cont = 0;
        for (let [name] of commands) {
            if (commands.get(name).name != 'help') {
                if (commands.get(name).permission != null) {
                    if (message.member.permissions.has(commands.get(name).permission || [])) {
                        embed.fields[cont] = { name: `.${commands.get(name).name}`, value: commands.get(name).description, inline: true };
                    }
                } else {
                    embed.fields[cont] = { name: `.${commands.get(name).name}`, value: commands.get(name).description, inline: true };
                }
                cont++;
            }
        }
        message.reply({ embeds: [embed] });
    }
}
