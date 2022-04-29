const User = require('../models/user');
const Friendship = require('../models/friendship');

// create friend request
module.exports.create = async function(req, res){
    try{
        let toUser = await User.findById(req.query.toUser);
        let fromUser = await User.findById(req.user.id);
        
        let friendship = await Friendship.findOne({
            fromUser: fromUser._id,
            toUser: toUser._id
        });

        let reverseFriendship = await Friendship.findOne({
            fromUser: toUser.id,
            toUser: fromUser.id
        });

        if(friendship || reverseFriendship){
            console.log('friendship request already exists !');
        }else{
            let newFriendship = await Friendship.create({
                fromUser: fromUser._id,
                toUser: toUser._id,
                accepted: false
            });

            fromUser.sentReqs.push(newFriendship);
            toUser.receivedReqs.push(newFriendship);

            await fromUser.save();
            await toUser.save();
        }

        if(req.xhr){
            return res.status(200).json({
                message: 'Friend request sent!'
            });
        }


    }catch(err){
        console.log('error: ', err);
        return res.redirect('back');
    }
}

module.exports.accept = async function(req, res){
    try{
        let fromUser = await User.findById(req.query.fromUser);
        let toUser = await User.findById(req.user.id).select({password: 0});

        let friendship = await Friendship.findOne({
            fromUser: fromUser.id,
            toUser: toUser.id 
        }).populate('fromUser', {password: 0}).populate('toUser', {password: 0});

        if(friendship){
            fromUser.sentReqs.pull(friendship.id);
            toUser.receivedReqs.pull(friendship.id);

            await fromUser.save();
            await toUser.save();

            friendship.accepted = true;
            await friendship.save();

            toUser.friends.push(friendship);
            fromUser.friends.push(friendship);

            await fromUser.save();
            await toUser.save();

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        friendship: friendship,
                        profile_user_id: fromUser.id,
                        curr_user: toUser,
                        accept: true
                    },
                    message: 'Friend request accepted !'
                });
            }
        }else{
            return res.status(404).json({
                message: 'Invalid request, no such friend request exists!'
            });
        }
    }catch(err){
        console.log('error', err);
        return res.redirect('back');
    }
}

module.exports.reject = async function(req, res){
    try{
        let fromUser = await User.findById(req.query.fromUser);
        let toUser = await User.findById(req.user.id).select({password: 0});

        let friendship = await Friendship.findOne({
            fromUser: fromUser.id,
            toUser: toUser.id 
        }).populate('fromUser', {password: 0}).populate('toUser', {password: 0});

        fromUser.sentReqs.pull(friendship.id);
        toUser.receivedReqs.pull(friendship.id);

        await fromUser.save();
        await toUser.save();

        friendship.remove();

        if(req.xhr){
            return res.status(200).json({
                data: {
                    friendship: friendship,
                    curr_user: toUser,
                    profile_user_id: fromUser.id,
                    accept: false
                },
                message: 'Friend request rejected !'
            });
        }


    }catch(err){
        console.log('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let friendship = await Friendship.findById(req.query.id);

        let fromUser = await User.findById(friendship.fromUser);
        let toUser = await User.findById(friendship.toUser);

        fromUser.friends.pull(friendship.id);
        toUser.friends.pull(friendship.id);

        await fromUser.save();
        await toUser.save();

        friendship.remove();

        if(req.xhr){
            return res.status(200).json({
                data: {
                    friendship_id: friendship.id,
                    profile_user_id: req.query.toUser
                },
                message: 'Friend removed !'
            });
        }

    }catch(err){
        console.log('error :', err);
        return res.redirect('back');
    }
}