const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res){

    let posts = await Post.find({}).sort('-createdAt').populate('user', {password: 0}).populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: {
                password: 0
            }
        }
    }).populate('likes');

    // return res.json(200, {
    //     message: 'list of posts',
    //     posts: []
    // });

    return res.status(200).json({
        message: 'List of posts',
        posts: posts 
    });
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        // console.log(post);

        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({
                post: req.params.id 
            });

            return res.status(200).json({
                message: 'Post and associated comments deleted !'
            });
        }else{
            return res.status(401).json({
                message: 'You cannot delete this post!'
            });
        }
    }catch(err){
        // console.log('Error', err);
        return res.status(500).json({
            message: 'Internal Server Error !'
        });
    }
}
