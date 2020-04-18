const mongoose = require('mongoose');

const userSchema1 = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true,
        max: 255,
        min: 2
    },
    LastName: {
        type: String,
        required: true,
        max: 255,
        min: 2
    },
    UserName: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    Email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    Password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    RegistrationDate: {
        type: Date,
        default: Date.now
    },
    ProfileStatus: {
        type: Boolean,
        default: true
    },
    sso: {
        type: String
    }
}, { timestamps: true });


module.exports = userSchema1;//mongoose.model('User', userSchema1);