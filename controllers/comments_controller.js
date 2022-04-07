const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(err){
            console.log('cannot find post with this id');
            return;
        }
        if(post){
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post 
            }, function(err, comment){
                if(err){
                    console.log('Cannot create comment');
                    return;
                }
                post.comments.push(comment);

                // post.save() updates the post object in the database
                post.save();
                return res.redirect('/');
            });
        }else{
            return res.redirect('back');
        }
    });
}