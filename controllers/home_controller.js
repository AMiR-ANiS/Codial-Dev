const Post = require('../models/post');

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
        return res.render('home',{
            title: 'Codial | Home',
            posts: posts 
        });
    });
}
