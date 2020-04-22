const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    firstname:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    lastname:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashPassword:{
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 1
    }
}, { timestamps: true })

//virtual fields
userSchema.virtual('password')
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.hashPassword = this.encryptPassword(password)
})
.get(function(password){
    return this._password
})

userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashPassword
    },

    encryptPassword: function(password){
        if(!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt)
                         .update(password)
                         .digest('hex')
        } catch (error) {
            return ""
        }
    }
}

module.exports = mongoose.model('user', userSchema)