const passport = require('passport');
const githubStrategy = require('passport-github').Strategy;

const User = require('../models/user');
const crypto = require('crypto');

passport.use(new githubStrategy({
    clientID: '2848ee28bd8d97d0a663',
    clientSecret: '17e87c88e2b68f66b87679aa1c58694148dc9eb5',
    callbackURL: 'http://localhost:8000/users/auth/github/callback'
}, async function(accessToken, refreshToken, profile, cb){
    try{
        let user = await User.findOne({
            email: profile.emails[0].value
        });

        if(user){
            cb(null, user);
        }else{
            let newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            cb(null, newUser);
        }
    }catch(err){
        console.log('error: ', err);
        cb(err); 
    }
}));

module.exports = passport;