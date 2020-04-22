const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const staffSchema = new mongoose.Schema({
    name: String,
    designation: String,
    contact: String
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    ageGroup: {
        type: String,
        required: true,
        trim: true
    },
    teamCoach: {
        type: Object
    },
    players: {
        type: Array
    },
    user:{
        type: ObjectId,
        ref: 'user',
        required: true
    },
    staff: [staffSchema]
}, { timestamps: true });

module.exports = mongoose.model('team', teamSchema);
