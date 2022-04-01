const ExtendedClient = require('./client/client.js');
const db = require('./database/database');
const client = new ExtendedClient();

db.then(() => console.log('\x1b[32m%s\x1b[0m', '[database] connected to MongoDB')).catch(err => console.log(err));
client.run();
