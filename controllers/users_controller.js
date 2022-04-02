module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: "User profile"
    });
};

module.exports.signUp = function(req, res){
    return res.render('user_sign_up', {
        title: "User Sign Up"
    });
};

module.exports.signIn = function(req, res){
    return res.render('user_sign_in', {
        title: "User Sign In"
    });
};