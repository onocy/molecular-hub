
const mongoose = require('mongoose');
const { Schema } = mongoose; 

const file = new Schema({
    name: {
        type: String
    },
    data: {
        type: Buffer
    },
    contentType: {
        type: String
    }
})

const molecule = new Schema ({ 
    name: {
        type: String
    },
    status: {
        type: String
    },
    files: {
        type: [fileSchema]
    }
})

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
    molecules: {
        type: [moleculeSchema]
    }
});

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
    playlists: {
        type: [playlistSchema]
    }
});

const notification = new Schema({
    title: {
        type: String
    }, 
    type: {
        type: String
    },
    date: {
        type: Date
    }
})

const File = mongoose.model('File', file);
const Molecule = mongoose.model('Molecule', molecule);
const Playlist = mongoose.model('Playlist', playlist);
const User = mongoose.model('User', user);
const Notification = mongoose.model('Notification', notification);

module.exports = {
    File, 
    Molecule, 
    Playlist, 
    User, 
    Notification
}