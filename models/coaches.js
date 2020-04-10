const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

const coachSchema = new mongoose.Schema({
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
        maxlength: 32
    },
    isActive: {
        type: Boolean,
        default: true
    },
    team: {
        type: ObjectId,
        ref: 'Team',
    },
    philosophy: {
        type: String,
        trim: true
    },
    photo:{
        data: Buffer,
        contentType: String
    },
    user:{
        type: ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('coach', coachSchema)
