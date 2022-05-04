// client side : subscriber

class ChatEngine{
    constructor(chatBoxId, userId, userName){
        this.chatBox = chatBoxId;
        this.userId = userId;
        this.userName = userName;

        // io is a global variable given by cdn js socket.io
        this.socket = io.connect('http://localhost:5000');
        //io.connect fires an event called connection in chat_sockets.js(server side), send the connect request to server(observer)

        if(this.userId){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){

            self.socket.emit('join_room', {
                user_id: self.userId,
                chat_room: 'codial',
                chat_id: self.chatBox
            });

            self.socket.on('user_joined', function(data){
                let box = $(`#${data.chat_id}`);
                let chat = $('#chat-message-list', box);
                chat.empty();
                for(let msg of data.messages){
                    let messageType = 'other-message';
                    let user = msg.name;
                    if(data.user_id == msg.userId){
                        messageType = 'self-message';
                        user = 'me';
                    }
                    let m = self.newMessageDom(messageType, msg.message, user);

                    chat.append(m);
                }

                chat.animate({
                    scrollTop: chat.prop('scrollHeight')
                }, 2000);
            });
        });

        $('#send-message').on('click', function(){
            let msg = $('#message-input').val();
            $('#message-input').val('');
            
            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_id: self.userId,
                    user_name: self.userName,
                    chat_room: 'codial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            let messageType = 'other-message';
            let user = data.user_name;
            if(data.user_id == self.userId){
                messageType = 'self-message';
                user = 'me';
            }

            let newMessage = self.newMessageDom(messageType, data.message, user);

            let chat = $('#chat-message-list');
            chat.append(newMessage);
            chat.animate({
                scrollTop: chat.prop('scrollHeight')
            }, 1000);
        });
    }

    newMessageDom(messageType, message, user){
        return $(`<li class="${messageType}">
                    <span>${message}</span>
                    <br>
                    <small>${user}</small>
                </li>`);
    }
}