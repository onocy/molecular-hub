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

const File = mongoose.model('File', file);

module.exports = File;