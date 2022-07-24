const router = require('express').Router();
const request = require('../utils/request.js');
const responseCodes = require('../constants/responseCodes.json');
const ticket = require('../systems/ticket.js');

const processRequest = async (type, req, res) => {
    const response = {
        'code': null,
        'channelLink': null,
    };
    const body = req.body;
    if (request.isValidRequest(body, 'userId')) {
        await ticket.open(type, body.userId, response, null, null);
    }
    else {
        response.code = responseCodes.badRequest;
    }
    res.send(response);
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
