module.exports = {
    name: 'ping',
    description: 'ping pong',
    run(message) {
        message.reply("Pinging...").then(m =>{
            const ping = m.createdTimestamp - message.createdTimestamp;
            m.edit(`**:ping_pong: Pong! Your Ping Is:** ${ping}ms`);
        });
    }
};
