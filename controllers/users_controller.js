const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');
const Post = require('../models/post');

module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

// sign in and create session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully!');
    res.redirect('/');
};

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out!');
    return res.redirect('/');
}

module.exports.profile = async function(req, res){
    try{
        let profileUser = await User.findById(req.params.id)
        .select({password: 0});
        
        if(profileUser){
            let friendButton = {
                add : false,
                sent: false,
                received: false,
                friend: false
            };

            let friendship = await Friendship.findOne({
                fromUser: req.user.id,
                toUser: profileUser.id,
                accepted: true
            });

            if(friendship){
                friendButton.friend = true;

                friendButton.id = friendship.id;
            }else{
                let reverseFriendship = await Friendship.findOne({
                    fromUser: profileUser.id,
                    toUser: req.user.id,
                    accepted: true
                });

                if(reverseFriendship){
                    friendButton.friend = true;

                    friendButton.id = reverseFriendship.id;
                }else{
                    let sentRequest = await Friendship.findOne({
                        fromUser: req.user.id,
                        toUser: profileUser.id,
                        accepted: false
                    });

                    if(sentRequest){
                        friendButton.sent = true;
                    }else{
                        let receivedRequest = await Friendship.findOne({
                            fromUser: profileUser.id,
                            toUser: req.user.id,
                            accepted: false
                        });

                        if(receivedRequest){
                            friendButton.received = true;
                        }else{
                            friendButton.add = true;
                        }
                    }
                }
            }

            let recentPosts = await Post.find({
                user: profileUser.id
            })
            .sort({createdAt: -1})
            .populate('user', {password: 0})
            .populate({
                path: 'comments',
                populate:{
                    path: 'user',
                    select: {
                        password: 0
                    }
                }
            })
            .populate('likes').populate({
                path: 'comments',
                populate: {
                    path: 'likes'
                }
            });

            return res.render('user_profile', {
                title: 'User Profile',
                profile_user: profileUser,
                friend_button: friendButton,
                recent_posts: recentPosts
            });
        }else{
            req.flash('error', 'user profile not found!');
            return res.redirect('back');
        }
        
    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.update = async function(req, res){
    try{
        if(req.params.id == req.user.id){            
            User.uploadedAvatar(req, res, async function(err){
                if(err){
                    console.log('*****Multer error:', err);
                    return res.redirect('back');
                }

                let user = await User.findById(req.params.id);

                // Without multer, req.body cannot be read because it is a multipart form.
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    // if user uploads a file

                    if(user.avatar){

                        // delete the existing avatar
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    // This is saving the path of the uploaded file into the avatar field in the user.
                }
                await user.save();
                return res.redirect('back');
            });

        }else{
            req.flash('error', 'Unauthorized');
            return res.status(401).send('Unauthorized');
        }
    }catch(err){
        console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.create = async function(req, res){
    try{
        if(req.body.password != req.body.confirm_password){
            req.flash('error', 'Enter confirm password same as password!');
            return res.redirect('back');
        }

        let user = await User.findOne({
            email: req.body.email 
        });

        if(!user){
            await User.create(req.body);
            req.flash('success', 'User account created successfully !');
            return res.redirect('/users/sign-in');
        }else{
            req.flash('error', 'User with the given email already exists !');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

