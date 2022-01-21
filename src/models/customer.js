const mongo = require('mongoose');

const CutomerSchema = new mongoose.Schema({
    id: { type: String, required: true},
    name: { type: String, required: true},
    invoiceday: { type: Number, required: true},
    openedticket: {type: Boolean, required: true},
    users: {type: Array, required: true},
    services: {type: Array, required: true}
});
const Customer = module.exports = mongoose.model('Customer', CutomerSchema);
