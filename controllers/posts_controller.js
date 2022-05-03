const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// module.exports.createPost = function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post){
//         if(err){
//             console.log('error in creating a post');
//             return;
//         }
//         return res.redirect('back');
//     });
// }

// module.exports.destroy = function(req, res){
//     Post.findById(req.params.id, function(err, post){
//         if(err){
//             console.log('error in finding the post');
//             return;
//         }

//         if(post.user == req.user.id){
//             // req.user._id = ObjectId
//             // req.user.id = ObjectId converted to string by mongoose
//             // .id converts the object id to string

//             post.remove();
//             Comment.deleteMany({
//                 post: req.params.id 
//             }, function(err){
//                 if(err){
//                     console.log('Cannot delete comments');
//                     return;
//                 }
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     });
// }

// Using async await

module.exports.createPost = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id 
        });

        await post.populate('user', {password: 0});
        
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post 
                },
                message: "post published!"
            });
        }

        // req.flash('success', 'post published !');
        // return res.redirect('back');
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        console.log('error: ', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        // console.log(post);

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

            await Comment.deleteMany({
                post: post._id
            });

            post.remove();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: post._id
                    },
                    message: "post deleted !" 
                });
            }

            // req.flash('success', 'Post and its associated comments deleted !');
            // return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized !');
            console.log('Unauthorized!');
            return res.redirect('back');
        }
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        console.log('error: ', err);
        return res.redirect('back');
    }
}