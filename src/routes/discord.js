const router = require('express').Router();
const request = require('../utils/request.js');
const responseCodes = require('../constants/responseCodes.json');
const { isDiscordId } = require('../utils/internal.js');
const { isMember } = require('../utils/discord.js');

const processRequest = (req, res) => {
    const body = req.body;
    if (request.isValidRequest(body, 'userId') && isDiscordId(body.userId)) {
        if (isMember(body.userId)) {
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
