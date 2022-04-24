const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

// module.exports.create = function(req, res){
//     Post.findById(req.body.post, function(err, post){
//         if(err){
//             console.log('cannot find post with this id');
//             return;
//         }
//         if(post){
//             Comment.create({
//                 content: req.body.content,
//                 user: req.user._id,
//                 post: req.body.post 
//             }, function(err, comment){
//                 if(err){
//                     console.log('Cannot create comment');
//                     return;
//                 }
//                 post.comments.push(comment);

//                 // post.save() updates the post object in the database
//                 post.save();
//                 return res.redirect('/');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     });
// }

// module.exports.destroy = function(req, res){
//     Comment.findById(req.params.id, function(err, comment){
//         if(err){
//             console.log('cannot delete comment');
//             return;
//         }
//         if(comment.user == req.user.id){
//             let postId = comment.post;
//             comment.remove();
//             Post.findByIdAndUpdate(postId, {
//                 $pull: {
//                     comments: req.params.id 
//                 }
//             }, function(err, post){
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }

//     });
// }

// Converting to async await

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
            post.save();

            await comment.populate('user', {name:1, email:1});

            // commentsMailer.newComment(comment);

            // let job = queueMicrotask.create('emails', comment).save(function(err){
            //     if(err){
            //         console.log('error in creating a queue', err);
            //         return;
            //     }

            //     console.log(job.id);
            // });

            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in sending to the queue', err);
                    return;
                }

                console.log('job enqueued', job.id);
            });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: post._id,
                        comment_id: comment._id,
                        comment_content: comment.content,
                        comment_user: req.user.name
                    },
                    message: 'comment added !'
                });
            }
            // req.flash('success', 'Comment added !');
            // return res.redirect('/');
        }else{
            req.flash('error', 'post to be commented upon does not exist !');
            return res.redirect('/');
        }
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('/');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();

            await Post.findByIdAndUpdate(postId, {
                $pull: {
                    comments: req.params.id 
                }
            });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: comment._id
                    },
                    message: 'Comment deleted !' 
                });
            }
            // req.flash('success', 'Comment deleted !');
            // return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}