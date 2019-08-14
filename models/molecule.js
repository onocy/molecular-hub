const mongoose = require('mongoose');
const file = require('./file');
const { Schema } = mongoose; 

const molecule = new Schema ({ 
    name: {
        type: String
    },
    status: {
        type: String
    },
    // files: {
    //     type: [file]
    // }
})

const Molecule = mongoose.model('Molecule', molecule);

module.exports = Molecule;