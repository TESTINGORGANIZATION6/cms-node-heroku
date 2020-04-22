const mongoose = require('mongoose')

const querySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    query: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    }
}, { timestamps: true })

module.exports = mongoose.model('question', querySchema)
