const mongoose = require('mongoose');
const molecule = require('./molecule');
const { Schema } = mongoose; 

const playlist = new Schema ({
    name: {
        type: String
    },
    displayInterval: {
        type: Number
    }, 
    createdAt: {
        type: Date
    }, 
    status: {
        type: String
    }, 
    // molecules: {
    //     type: [molecule]
    // }
});

const Playlist = mongoose.model('Playlist', playlist);

module.exports = Playlist;