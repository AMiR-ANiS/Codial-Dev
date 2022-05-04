const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const Like = require('../models/like');
const Reaction = require('../models/reaction');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id 
            });

            post.comments.push(comment);
            await post.save();

            await comment.populate('user', {password: 0});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment 
                    },
                    message: 'comment added!'
                });
            }
        }else{
            req.flash('error', 'post to be commented upon does not exist !');
            return res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        console.log('error: ', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;

            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    comments: req.params.id 
                }
            });

            await Like.deleteMany({
                likeable: comment._id,
                onModel: 'Comment'
            });

            await Reaction.deleteMany({
                entity: comment.id,
                onModel: 'Comment'
            });

            comment.remove();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id 
                    },
                    message: 'Comment deleted !' 
                });
            }
        }else{
            req.flash('error', 'Unauthorized');
            console.log('Unauthorized !');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('error :', err);
        return res.redirect('back');
    }
}