const mongoose = require('mongoose');
const playlist = require('./playlist');
const { Schema } = mongoose; 

const user = new Schema ({
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
    }, 
    // playlists: {
    //     type: [playlist]
    // }
});

const User = mongoose.model('User', user);

module.exports = User;