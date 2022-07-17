const router = require('express').Router();
const ticket = require('../systems/ticket.js');

router.post('/support', async (req, res) => {
    const status = await ticket.open('support', req.body.userId, null, null);
    res.send(status.toString());
});

router.post('/information', async (req, res) => {
    const status = await ticket.open('information', req.body.userId, null, null);
    res.send(status.toString());
});

router.post('/invoice', async (req, res) => {
    const status = await ticket.open('invoice', req.body.userId, null, null);
    res.send(status.toString());
});

router.post('/order', async (req, res) => {
    const status = await ticket.open('order', req.body.userId, null, null);
    res.send(status.toString());
});

module.exports = router;
