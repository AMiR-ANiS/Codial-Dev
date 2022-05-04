// server side: observer

const ChatMessage = require('../models/chat_message');

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://localhost:8000'
        }
    });

    io.sockets.on('connection', function(socket){
        socket.on('disconnect', function(){
            
        });

        socket.on('join_room', async function(data){
            try{
                socket.join(data.chat_room);

                let msgs = await ChatMessage.find({
                    room: data.chat_room
                });

                data.messages = msgs;
    
                // emit in a specific chat room
                io.in(data.chat_room).emit('user_joined', data);
            }catch(err){
                console.log('error: ', err);
            }
        });

        socket.on('send_message', async function(data){
            try{
                let msg = await ChatMessage.create({
                    message: data.message,
                    name: data.user_name,
                    userId: data.user_id,
                    room: data.chat_room
                });

                io.in(data.chat_room).emit('receive_message', data);
            }catch(err){
                console.log('error: ', err);
            }
        });
    });

}