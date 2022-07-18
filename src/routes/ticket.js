const router = require('express').Router();
const request = require('../utils/request');
const ticket = require('../systems/ticket.js');

const response = {
    'code': -3,
    'channel_link': '',
};

const processRequest = async (type, req, res) => {
    const cloneResponse = { ...response };
    const body = req.body;
    if (request.isValidRequest(body, 'userId')) {
        await ticket.open(type, body.userId, cloneResponse, null, null);
    }
    else {
        cloneResponse.code = 400;
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
