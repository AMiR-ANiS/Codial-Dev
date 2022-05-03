const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
    reaction: {
        type: String,
        enum: ['haha', 'love', 'angry', 'sad', 'wow'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true
    },
    onModel: {
        type: String,
        enum: ['Post', 'Comment'],
        required: true
    }
}, {
    timestamps: true
});

const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = Reaction;