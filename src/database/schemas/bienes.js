const mongoose = require('mongoose');

const BienesSchema = new mongoose.Schema({
    nombe: {
        type: String
    }
})

module.exports = mongoose.model('bienes', BienesSchema);