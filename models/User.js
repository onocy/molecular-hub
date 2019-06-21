const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose; 

let SALT = 10; 

const userSchema = new Schema ({
    firstName: {
        type: String,
        unique: false 
    },
    lastName: {
        type: String, 
        unique: false
    },
    email: {
        type: String, 
        unique: true
    },
    password: {
        type: String, 
    } 
});

module.exports = mongoose.model('User', userSchema);