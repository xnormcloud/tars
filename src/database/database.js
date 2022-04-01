const mongoose = require('mongoose');
const config = require('../config/config.json');

module.exports = mongoose.connect(config.mongo, { useNewUrlParser: true, useUnifiedTopology: true });
