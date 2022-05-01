const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    userId: {
        type: String
    },
    name: {
        type: String,
    },
    room: {
        type: String,
    }
}, {
    timestamps: true 
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;

