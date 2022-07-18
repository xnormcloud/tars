const router = require('express').Router();
const { isInsideDiscord } = require('../systems/ticket.js');

const processRequest = (req, res) => {
    // if req.body empty or userId not valid as a discord id
    if (Object.keys(req.body).length === 0 || req.body.userId.length !== 18) {
        res.send('400');
    }
    else if (isInsideDiscord(req.body.userId)) {
        res.send('302');
    }
    else {
        res.send('404');
    }
};

router.post('/inside', async (req, res) => {
    processRequest(req, res);
});

module.exports = router;
