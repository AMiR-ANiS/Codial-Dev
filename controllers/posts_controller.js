const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createPost = function(req, res){
    Post.create({
        content: req.body.content,
        user: req.user._id
    }, function(err, post){
        if(err){
            console.log('error in creating a post');
            return;
        }
        return res.redirect('back');
    });
}

module.exports.destroy = function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log('error in finding the post');
            return;
        }

        if(post.user == req.user.id){
            // req.user._id = ObjectId
            // req.user.id = ObjectId converted to string by mongoose
            // .id converts the object id to string

            post.remove();
            Comment.deleteMany({
                user: req.params.id 
            }, function(err){
                if(err){
                    console.log('Cannot delete comments');
                    return;
                }
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });
}