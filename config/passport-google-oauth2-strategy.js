const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: '477848634246-4o4bic6s43lsm89u57vhq8p0m3s9eusi.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/users/auth/google/callback'
}, function(accessToken, refreshToken, profile, done){
    User.findOne({
        email: profile.emails[0].value
    }).exec(function(err, user){
        if(err){
            console.log('error in google-strategy-passport', err);
            return;
        }
        // console.log(profile);
        if(user){
            return done(null, user);
        }else{
            // if user is not found, create user and set it as req.user
            // sign in/ sign up with google

            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(err, user){
                if(err){
                    console.log('error in creating user', err);
                    return;
                }
                return done(null, user);
            });
        }
    });
}));

module.exports = passport;