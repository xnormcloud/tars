const config = require('../config/config.json');

module.exports = {
    name: 'help',
    description: 'command help',
    run(message, commands) {
        const embed = {
            color: config.colors.orange,
            author: { name: 'Commands Help' },
            fields: [],
            timestamp: new Date(),
            footer: { text: `ID: ${message.member.id}` }
        };
        // commands fields info
        var cont = 0;
        for (let [name] of commands) {
            if (commands.get(name).name != 'help') {
                embed.fields[cont] = { name: `.${commands.get(name).name}`, value: commands.get(name).description };
                cont++;
            };
        };
        message.reply({ embeds: [embed] });
    }
};
