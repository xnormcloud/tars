const { generateConfig } = require('./systems/config.js');
if (generateConfig()) return console.log('Config generated, fill it and then start it again!');

const express = require('express');
const helmet = require('helmet');
const app = express();
const argument = process.argv[2];
const port = argument === '-t' ? 6000 : argument === '-p' ? 5023 : 5000;
const ExtendedClient = require('./client/client.js');

// rest api
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(express.json());

const ticketRoute = require('./routes/ticket.js');
app.use('/ticket', ticketRoute);
const discordRoute = require('./routes/discord.js');
app.use('/discord', discordRoute);
app.get('/', async (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log('Now listening to requests on port ' + `${port}`);
    console.log(`Access by http://127.0.0.1:${port} (${port === 6000 ? 'test' : port === 5000 ? 'dev' : 'prod'})`);
});

// discord bot
const client = new ExtendedClient();
client.run();
