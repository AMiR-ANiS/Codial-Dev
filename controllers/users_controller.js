const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const Friendship = require('../models/friendship');

// module.exports.profile = function(req, res){
//     User.findById(req.params.id, function(err, user){
//         if(err){
//             console.log('error in fetching the user from db');
//             return;
//         }
//         return res.render('user_profile',{
//             title: 'User Profile',
//             profile_user: user 
//         });
//     });
// };

// module.exports.update = function(req, res){
//     if(req.params.id == req.user.id){
//         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
//             if(err){
//                 console.log('error in updating the user');
//                 return;
//             }
//             return res.redirect('back');
//         });
//     }else{
//         return res.status(401).send('Unauthorized');
//     }
// }

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

// get the sign up date
// module.exports.create = function(req, res){
//     if(req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }
//     User.findOne({
//         email: req.body.email 
//     }, function(err, user){
//         if(err){
//             console.log('Error in finding the user while signing up');
//             return;
//         }
//         if(!user){
//             User.create(req.body, function(err, user){
//                 if(err){
//                     console.log('Error in creating user while signing up');
//                     return;
//                 }
//                 return res.redirect('/users/sign-in');
//             });
//         }
//         else{
//             res.redirect('back');
//         }
//     });
// };

// sign in and create session for the user
module.exports.createSession = function(req, res){
    // Use flash messages
    // req.flash(key, value); -> set key
    // req.flash(key); -> access key
    req.flash('success', 'Logged in successfully!');
    res.redirect('/');
};

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out!');
    return res.redirect('/');
}

// Converting to async await

module.exports.profile = async function(req, res){
    try{
        let currentUser = await User.findById(req.user.id);
        let profileUser = await User.findById(req.params.id).select({password: 0});
        
        if(profileUser){
            let friendButton = {
                add : false,
                sent: false,
                received: false,
                friend: false
            };

            let friendship = await Friendship.findOne({
                fromUser: currentUser.id,
                toUser: profileUser.id,
                accepted: true
            });

            if(friendship){
                friendButton.friend = true;

                friendButton.id = friendship.id;
            }else{
                let reverseFriendship = await Friendship.findOne({
                    fromUser: profileUser.id,
                    toUser: currentUser.id,
                    accepted: true
                });

                if(reverseFriendship){
                    friendButton.friend = true;

                    friendButton.id = reverseFriendship.id;
                }else{
                    let sentRequest = await Friendship.findOne({
                        fromUser: currentUser.id,
                        toUser: profileUser.id,
                        accepted: false
                    });

                    if(sentRequest){
                        friendButton.sent = true;
                    }else{
                        let receivedRequest = await Friendship.findOne({
                            fromUser: profileUser.id,
                            toUser: currentUser.id,
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

            console.log(friendButton);

            return res.render('user_profile', {
                title: 'User Profile',
                profile_user: profileUser,
                friend_button: friendButton
            });
        }else{
            req.flash('error', 'user profile not found!');
            return res.redirect('back');
        }
        
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.update = async function(req, res){
    try{
        if(req.params.id == req.user.id){
            // await User.findByIdAndUpdate(req.params.id, req.body);
            // req.flash('success', 'Profile updated successfully!');
            // return res.redirect('back');
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('*****Multer error:', err);
                    return res.redirect('back');
                }
                // console.log(req.file);

                // Without multer, req.body cannot be read because it is a multipart form.
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    // if user uploads a file

                    if(user.avatar){
                        // delete the existing avatar
                        // fs and path need to be used

                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                    // This is saving the path of the uploaded file into the avatar field in the user.
                }
                user.save();
                return res.redirect('back');
            });

        }else{
            req.flash('error', 'Unauthorized');
            return res.status(401).send('Unauthorized');
        }
    }catch(err){
        // console.log('Error', err);
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
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

