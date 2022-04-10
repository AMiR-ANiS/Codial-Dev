const User = require('../models/user');

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
    req.flash('success', 'Logged in successfully');
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
        let user = await User.findById(req.params.id);

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user 
        });
    }catch(err){
        console.log('Error', err);
        return;
    }
}

module.exports.update = async function(req, res){
    try{
        if(req.params.id == req.user.id){
            await User.findByIdAndUpdate(req.params.id, req.body);
            return res.redirect('back');
        }else{
            return res.status(401).send('Unauthorized');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
}

module.exports.create = async function(req, res){
    try{
        if(req.body.password != req.body.confirm_password){
            return res.redirect('back');
        }

        let user = await User.findOne({
            email: req.body.email 
        });

        if(!user){
            await User.create(req.body);

            return res.redirect('/users/sign-in');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
}

