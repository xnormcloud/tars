const { generateConfig } = require('./systems/config.js');
if (generateConfig()) return console.log('Config generated, fill it and then start it again!');

const ExtendedClient = require('./client/client.js');
const discordClient = new ExtendedClient();
discordClient.run();
