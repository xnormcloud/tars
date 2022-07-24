const express = require('express');
const helmet = require('helmet');
const app = express();
const argument = process.argv[2];
const port = argument === '-t' ? 6000 : argument === '-p' ? 5023 : 5000;
const colors = require('../constants/colors.js');
const { findFiles } = require('../utils/internal.js');

const registerRoutes = async () => {
    const routeFiles = findFiles('/src/routes');
    routeFiles.forEach(async routeFile => {
        const route = require(`../routes/${routeFile}`);
        const routeName = `/${routeFile.slice(0, -3)}`;
        app.use(routeName, route);
        console.log(colors.console.blueReset, `[routes] ${routeName} loaded`);
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
                console.log(
                    colors.console.greenReset, '[api] now listening to requests on port',
                    colors.console.orange + `${port}`,
                );
                console.log(
                    colors.console.greenReset, '[api] access by',
                    colors.console.orange + `http://127.0.0.1:${port} (${port === 6000 ? 'test' : port === 5000 ? 'dev' : 'prod'})`,
                    colors.console.reset,
                );
            });
        });
    },

};
