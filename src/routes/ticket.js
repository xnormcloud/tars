const router = require('express').Router();
const request = require('../utils/request');
const responseCodes = require('../constants/responseCodes.json');
const ticket = require('../systems/ticket.js');

const response = {
    'code': '0',
    'channelLink': '',
};

const processRequest = async (type, req, res) => {
    const cloneResponse = { ...response };
    const body = req.body;
    if (request.isValidRequest(body, 'userId')) {
        await ticket.open(type, body.userId, cloneResponse, null, null);
    }
    else {
        cloneResponse.code = responseCodes.badRequest;
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

module.exports = router;
