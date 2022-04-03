const User = require('../models/user');

module.exports.profile = function(req, res){
    if(req.cookies.user_id){

        // User.findById runs asynchronously so if else statement is both necessary
        User.findById(req.cookies.user_id, function(err, user){
            if(user){
                return res.render('user_profile', {
                    title: "User profile",
                    user: user 
                });
            }
            return res.redirect('/users/sign-in');
        });
    }else{
        return res.redirect('/users/sign-in');
    }
};

module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    });
};

module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    });
};

// get the sign up date
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({
        email: req.body.email 
    }, function(err, user){
        if(err){
            console.log('Error in finding the user while signing up');
            return;
        }
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            res.redirect('back');
        }
    });
};

// sign in and create session for the user
module.exports.createSession = function(req, res){
    // Find the user
    User.findOne({
        email: req.body.email 
    }, function(err, user){
        if(err){
            console.log('Error in finding the user while signing in');
            return;
        }

        // handle user found
        if(user){
            // handle password mismatch

            if(user.password != req.body.password){
                return res.redirect('back');
            }

            // handle session creation
            console.log(user.id);
            console.log(user._id);
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }else{
            // handle user not found

            res.redirect('back');
        }
    });
};
