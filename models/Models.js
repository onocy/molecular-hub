
const mongoose = require('mongoose');
const { Schema } = mongoose; 


const fileSchema = new Schema({
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

const moleculeSchema = new Schema ({ 
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

const playlistSchema = new Schema ({
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
    //     type: [moleculeSchema]
    // }
});


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
    }, 
    playlists: {
        type: [playlistSchema]
    }
});

const File = mongoose.model('File', fileSchema);
const Molecule = mongoose.model('Molecule', moleculeSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    File, 
    Molecule, 
    Playlist, 
    User
}