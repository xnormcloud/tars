const express = require('express');
const helmet = require('helmet');
const app = express();
const argument = process.argv[2];
const port = argument === '-t' ? 6000 : argument === '-p' ? 5023 : 5000;
const fs = require('fs');
const { dirname } = require('../constants/general.js');

const registerRoutes = async () => {
    const routeFiles = fs.readdirSync(`${dirname}/src/routes`).filter(file => file.endsWith('.js'));
    routeFiles.forEach(async routeFile => {
        const route = require(`../routes/${routeFile}`);
        const routeName = `/${routeFile.slice(0, -3)}`;
        app.use(routeName, route);
        console.log('\x1b[32m%s\x1b[0m', `[routes] ${routeName} loaded`);
    });
    app.get('/', async (req, res) => {
        res.sendStatus(200);
    });
};

module.exports = {

    start: () => {
        app.use(helmet({
            contentSecurityPolicy: false,
        }));
        app.use(express.json());
        registerRoutes().then(() => {
            app.listen(port, () => {
                console.log('\x1b[32m%s\x1b[0m', `[api] now listening to requests on port ${port}`);
                console.log('\x1b[32m%s\x1b[0m', `[api] access by http://127.0.0.1:${port} (${port === 6000 ? 'test' : port === 5000 ? 'dev' : 'prod'})`);
            });
        });
    },

};
