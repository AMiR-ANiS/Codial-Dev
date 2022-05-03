const Post = require('../models/post');
const Comment = require('../models/comment');
const Reaction = require('../models/reaction');

module.exports.toggle = async function(req, res){
    try{
        let entity;
        let reacts = {
            haha: 0,
            wow: 0,
            angry: 0,
            sad: 0,
            love: 0
        };

        if(req.query.type == 'Post'){
            entity = await Post.findById(req.query.id);
        }else{
            entity = await Comment.findById(req.query.id);
        }

        let existingReaction = await Reaction.findOne({
            user: req.user.id,
            entity: req.query.id,
            onModel: req.query.type
        });

        if(existingReaction){
            if(req.query.react == existingReaction.reaction){
                switch(req.query.react){
                    case 'haha': entity.haha.pull(existingReaction.id);
                    break;
                    case 'wow': entity.wow.pull(existingReaction.id);
                    break;
                    case 'love': entity.love.pull(existingReaction.id);
                    break;
                    case 'angry': entity.angry.pull(existingReaction.id);
                    break;
                    default: entity.sad.pull(existingReaction.id);
                }
                await entity.save();
                existingReaction.remove();

                let reactType = req.query.react;
                reacts[reactType] = -1; 
            }else{
                let prevReaction = existingReaction.reaction;
                let newReaction = req.query.react;

                switch(prevReaction){
                    case 'haha': entity.haha.pull(existingReaction.id);
                    break;
                    case 'wow': entity.wow.pull(existingReaction.id);
                    break;
                    case 'love': entity.love.pull(existingReaction.id);
                    break;
                    case 'angry': entity.angry.pull(existingReaction.id);
                    break;
                    default: entity.sad.pull(existingReaction.id);
                }
                await entity.save();

                existingReaction.reaction = newReaction;
                await existingReaction.save();

                switch(newReaction){
                    case 'haha': entity.haha.push(existingReaction);
                    break;
                    case 'wow': entity.wow.push(existingReaction);
                    break;
                    case 'love': entity.love.push(existingReaction);
                    break;
                    case 'angry': entity.angry.push(existingReaction);
                    break;
                    default: entity.sad.push(existingReaction);
                }
                await entity.save();

                reacts[prevReaction] = -1;
                reacts[newReaction] = 1;
            }
        }else{
            let newReaction = await Reaction.create({
                user: req.user.id,
                entity: req.query.id,
                onModel: req.query.type,
                reaction: req.query.react
            });

            switch(req.query.react){
                case 'haha': entity.haha.push(newReaction);
                break;
                case 'wow': entity.wow.push(newReaction);
                break;
                case 'love': entity.love.push(newReaction);
                break;
                case 'angry': entity.angry.push(newReaction);
                break;
                default: entity.sad.push(newReaction); 
            }
            await entity.save();

            let reactType = req.query.react;
            reacts[reactType] = 1;
        }

        if(req.xhr){
            return res.status(200).json({
                data: {
                    reacts: reacts,
                    id: req.query.id,
                    type: req.query.type
                },
                message: 'request successful!'
            });
        }

    }catch(err){
        console.log('error: ', err);
        return res.redirect('back');
    }
}

module.exports.check = async function(req, res){
    try{
        let existingReaction = await Reaction.findOne({
            user: req.user.id,
            entity: req.query.id,
            onModel: req.query.type,
            reaction: req.query.react
        });

        let exist = false;
        if(existingReaction){
            exist = true;
        }

        if(req.xhr){
            return res.status(200).json({
                data: {
                    exist: exist
                },
                message: 'request successful'
            });
        }
    }catch(err){
        console.log('error', err);
        return res.redirect('back');
    }
}