const { generateConfig } = require('./utils/config');

// generate config if not already generated
generateConfig();
const ExtendedClient = require('./client/client.js');
const client = new ExtendedClient();
client.run();
