const mongoose = require('mongoose');
const { Schema } = mongoose; 

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

const Notification = mongoose.model('Notification', notification);

module.exports = Notification;