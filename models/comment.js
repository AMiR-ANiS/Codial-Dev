const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true 
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ],
    haha: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ],
    love: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ],
    wow: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ],
    angry: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ],
    sad: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reaction'
        }
    ]
},{
    timestamps: true 
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

