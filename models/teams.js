const mongoose = require('mongoose');

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
        trim: true
    },
    ageGroup: {
        type: String,
        required: true,
        trim: true
    },
    teamCoach: {
        type: String
    },
    players: {
        type: String
    },
    staff: [staffSchema]
}, { timestamps: true });

module.exports = mongoose.model('team', teamSchema);
