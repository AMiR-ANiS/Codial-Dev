const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
const Reaction = require('../models/reaction');
const fs = require('fs');
const path = require('path');

module.exports.createPost = async function(req, res){
    try{

        let post;
        let exist = false;

        if(req.file){
            exist = true;
            post = await Post.create({
                content: req.body.content,
                imagePath: Post.imagePath + '/' + req.file.filename,
                user: req.user.id
            });
        }else{
            post = await Post.create({
                content: req.body.content,
                user: req.user.id
            });
        }
        
        await post.populate('user', {password: 0});

        return res.status(200).json({
            data: {
                post: post,
                exist: exist
            },
            message: 'Post published'
        });

    }catch(err){
        req.flash('error', err);
        console.log('error: ', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            await Like.deleteMany({
                likeable: post._id,
                onModel: 'Post'
            });

            await Like.deleteMany({
                likeable: {
                    $in: post.comments
                },
                onModel: 'Comment'
            });

            await Reaction.deleteMany({
                entity: post.id,
                onModel: 'Post'
            });

            await Reaction.deleteMany({
                entity: {
                    $in: post.comments
                },
                onModel: 'Comment'
            });

            await Comment.deleteMany({
                post: post._id
            });

            if(post.imagePath){
                fs.unlinkSync(path.join(__dirname, '..', post.imagePath));
            }
            post.remove();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: post._id
                    },
                    message: "post deleted !" 
                });
            }

        }else{
            req.flash('error', 'Unauthorized !');
            console.log('Unauthorized!');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log('error: ', err);
        return res.redirect('back');
    }
}