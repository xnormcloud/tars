const colors = require('./constants/colors.js');
const { generateConfig } = require('./systems/config.js');
if (generateConfig()) return console.log(colors.console.orangeReset, 'Config generated, fill it and then start it again!');

require('dotenv').config();
const notion = require('./database/notion.js');
if (!notion.updateDatabase()) return;

const DiscordClient = require('./client/bot.js');
const discordClient = new DiscordClient();
discordClient.run();
