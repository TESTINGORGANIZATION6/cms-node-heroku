const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const playerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    team: {
        type: ObjectId,
        ref: 'team',
    },
    position: {
        type: String,
        required: true,
        trim: true,
        maxlength: 32
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    user:{
        type: ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('player', playerSchema)
