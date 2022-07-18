const router = require('express').Router();
const ticket = require('../systems/ticket.js');

const response = {
    'code': -3,
    'channel_link': '',
};

const processRequest = async (type, req, res) => {
    const cloneResponse = { ...response };
    // if req.body empty
    if (Object.keys(req.body).length === 0) {
        cloneResponse.code = 1;
    }
    else {
        await ticket.open(type, req.body.userId, cloneResponse, null, null);
    }
    res.send(cloneResponse);
};

router.post('/information', async (req, res) => {
    await processRequest('information', req, res);
});

router.post('/order', async (req, res) => {
    await processRequest('order', req, res);
});

router.post('/support', async (req, res) => {
    await processRequest('support', req, res);
});

router.post('/invoice', async (req, res) => {
    await processRequest('invoice', req, res);
});

module.exports = router;
