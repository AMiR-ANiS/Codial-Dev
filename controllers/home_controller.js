const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 34);
    // Post.find({}, function(err,posts){
    //     return res.render('home',{
    //         title: 'Codial | Home',
    //         posts: posts 
    //     });
    // });

    // Populate the user of each post
    Post.find({}).populate('user')
    .populate({
        path: 'comments',
        populate:{
            path: 'user'
        }
    })
    .exec(function(err, posts){
        User.find({}, function(err, users){
            if(err){
                console.log('cannot fetch users from the db');
                return;
            }
            return res.render('home', {
                title: 'Codial | Home',
                posts: posts,
                all_users: users 
            });
        });
    });
}
