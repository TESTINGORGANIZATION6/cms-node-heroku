//added this for future use
const mongoose = require('mongoose');

const playerSchemna = new mongoose.Schema({
    UserId: {
        type: String,
        required: true
    },
    //SETP 1
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
    DateOfBirth: {
        type: Date,
        required: true,
    },
    Nationality: {
        type: String,
        required: true
    },
    Height: {
        type: Number,
        required: true
    },
    Weight: {
        type: Number,
        required: true
    },
    //Step 2
    Position: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    },
    Foot: {
        type: String,
        required: true
    },
    Skills: {
        type: String,
        required: false,
    },
    Agent: {
        type: String,
        required: false,
    },
    Clubs: [{
        ClubName: {
            type: String
        },
        From: {
            type: Date
        },
        To: {
            type: Date
        },
        Achievements: {
            type: String,
            required: false,
        }
    }],
    //Step 4
    Ratings: {
        Catching: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Punching: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Throwing: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Reflexes: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Distribution: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Center_Defender: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Right_Back: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Left_Back: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Agility: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Tackle: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Strength: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Positioning: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Communication: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Ariel_Ability: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Vision: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Crossing: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Fitness: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Shooting: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Ball_Control: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Dribbling: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        First_Touch: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Passing: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
        Heading: {
            type: Number,
            default: 0,
            max: 10,
            min: 0,
            required: false,
        },
    },
    Ambition: {
        type: String,
        required: false,
    },
    MobileNumber: {
        type: Number,
        required: true,
    },
    AlternateMobileNumber: {
        type: Number,
        required: false,
    },
    Email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    ReferencedCoach: {
        type: String,
        required: false,
    },
    Photo: {
        type:String
    },
}, { timestamps: true });

module.exports = mongoose.model('Player', playerSchemna);