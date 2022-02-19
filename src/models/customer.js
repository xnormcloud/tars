const mongo = require('mongoose');

const CutomerSchema = new mongo.Schema({
    id: { type: String, required: true},
    name: { type: String, required: true},
    invoiceday: { type: Number, required: true},
    openedticket: {type: Boolean, required: true},
    users: {type: Array, required: true},
    services: {type: Array, required: true}
});

const Customer = module.exports = mongo.model('Customer', CutomerSchema);
