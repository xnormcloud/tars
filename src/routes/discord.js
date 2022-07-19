const router = require('express').Router();
const request = require('../utils/request.js');
const responseCodes = require('../constants/responseCodes.json');
const { isInsideDiscord } = require('../systems/ticket.js');

const processRequest = (req, res) => {
    const body = req.body;
    // bad request or userId not valid as a discord id
    if (request.isValidRequest(body, 'userId') && body.userId.length === 18) {
        if (isInsideDiscord(body.userId)) {
            res.send(responseCodes.found);
        }
        else {
            res.send(responseCodes.notFound);
        }
    }
    else {
        res.send(responseCodes.badRequest);
    }
};

router.post('/inside', async (req, res) => {
    processRequest(req, res);
});

module.exports = router;
