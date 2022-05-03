const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true 
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

