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
        let posts = await Post.find({})
        .sort({createdAt: -1})
        .populate('user', {password: 0})
        .populate({
            path: 'comments',
            populate:{
                path: 'user',
                select: {
                    password: 0
                }
            }
        })
        .populate('likes')
        .populate({
            path: 'comments',
            populate: {
                path: 'likes'
            }
        })
        .populate('haha')
        .populate('wow')
        .populate('love')
        .populate('angry')
        .populate('sad');

        let users = await User.find({})
        .select({password: 0});

        if(req.user){
            let currUser = await User.findById(req.user.id)
            .populate({
                path: 'receivedReqs',
                populate: {
                    path: 'fromUser',
                    select: {
                        password: 0 
                    }
                }
            })
            .populate({
                path: 'friends',
                populate: {
                    path: 'fromUser',
                    select: {
                        password: 0
                    }
                }
            })
            .populate({
                path: 'friends',
                populate: {
                    path: 'toUser',
                    select: {
                        password: 0
                    }
                }
            });

            return res.render('home', {
                title: "Codial | Home",
                posts: posts,
                users: users,
                curr_user: currUser
            });
        }else{
            return res.render('home', {
                title: "Codial | Home",
                posts: posts,
                users: users
            });
        }

    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        console.log('error ', err);
        return res.redirect('back');
    }
}