const mongoose = require('mongoose');
const { Schema } = mongoose; 

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