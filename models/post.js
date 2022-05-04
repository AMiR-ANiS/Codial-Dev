const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const IMAGE_PATH = path.join('/uploads/posts/images');

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
    imagePath: {
        type: String
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

let postStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, '..', IMAGE_PATH));
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now());
    }
});

postSchema.statics.imagePath = IMAGE_PATH;
postSchema.statics.uploadImage = multer({storage: postStorage}).single('image');

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

