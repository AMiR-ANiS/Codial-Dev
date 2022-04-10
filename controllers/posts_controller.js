const Post = require('../models/post');
const Comment = require('../models/comment');

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
        await Post.create({
            content: req.body.content,
            user: req.user._id 
        });

        req.flash('success', 'post published !');
        return res.redirect('back');
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({
                post: req.params.id 
            });

            req.flash('success', 'Post and its associated comments deleted !');
            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized !');
            return res.redirect('back');
        }
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}