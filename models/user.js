const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true 
    },
    name: {
        type: String,
        required: true 
    },
    avatar: {
        type: String
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ],
    sentReqs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ],
    receivedReqs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ]
}, {
    timestamps: true 
});

let storage = multer.diskStorage({
    destination: function(req, file, cb){
        // cb is call back
        cb(null, path.join(__dirname, '..', AVATAR_PATH));
        // __dirname is current directory: models
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now());
        // file.fieldname:  avatar
    }
});

// static methods

userSchema.statics.uploadedAvatar = multer({
    storage: storage 
}).single('avatar');

//.single : only one instance/file will be uploaded for the field avatar, not multiple files.

userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;