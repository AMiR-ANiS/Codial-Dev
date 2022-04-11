const Post = require('../models/post');
const User = require('../models/user');

// module.exports.home = function(req, res){
//     // console.log(req.cookies);
//     // res.cookie('user_id', 34);
//     // Post.find({}, function(err,posts){
//     //     return res.render('home',{
//     //         title: 'Codial | Home',
//     //         posts: posts 
//     //     });
//     // });

//     // Populate the user of each post
//     Post.find({}).populate('user')
//     .populate({
//         path: 'comments',
//         populate:{
//             path: 'user'
//         }
//     })
//     .exec(function(err, posts){
//         User.find({}, function(err, users){
//             if(err){
//                 console.log('cannot fetch users from the db');
//                 return;
//             }
//             return res.render('home', {
//                 title: 'Codial | Home',
//                 posts: posts,
//                 all_users: users 
//             });
//         });
//     });
// }

// Using then
// Post.find({}).populate('comments').then('callback function');

// let posts = Post.find({}).populate('comments').exec();
// posts.then();

// Using async await

module.exports.home = async function(req, res){
    try{
        let posts = await Post.find({}).sort('-createdAt').populate('user').populate({
            path: 'comments',
            populate:{
                path: 'user' 
            }
        });

        let users = await User.find({});

        return res.render('home', {
            title: "Codial | Home",
            posts: posts,
            all_users: users 
        });
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
}