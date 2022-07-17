const express = require('express');
const helmet = require('helmet');
const app = express();
const argument = process.argv[2];
const PORT = argument === '-t' ? 6000 : argument === '-p' ? 5023 : 5000;
const { generateConfig } = require('./systems/config.js');

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(express.json());

const ticketRoute = require('./routes/ticket');
app.use('/ticket', ticketRoute);
app.get('/', async (req, res) => {
    res.sendStatus(200);
});

// generate config if not already generated
generateConfig();
const ExtendedClient = require('./client/client.js');
const client = new ExtendedClient();
client.run();

app.listen(PORT, () => {
    console.log('Now listening to requests on port ' + `${PORT}`);
    console.log(`Access by http://127.0.0.1:${PORT} (${PORT === 6000 ? 'test' : PORT === 5000 ? 'dev' : 'prod'})`);
});
