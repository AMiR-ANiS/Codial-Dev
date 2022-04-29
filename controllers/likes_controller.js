const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function(req, res){
    try{
        // route: /likes/toggle/?id=postId/commentId&type=post/comment

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');

        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if(existingLike){
            likeable.likes.pull(existingLike._id);
            await likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type 
            });

            likeable.likes.push(newLike);
            await likeable.save();
        }

        if(req.xhr){
            return res.status(200).json({
                data: {
                    deleted: deleted 
                },
                message: 'request successful!'
            });
        }
    }catch(err){
        console.log('error *****', err);
        req.flash('error', err);
        return res.status(500).json({
            message: 'Internal Server Error !'
        });
    }
}