// client side : subscriber

class ChatEngine{
    constructor(chatBoxId, userEmail, userName){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;

        // io is a global variable given by cdn js socket.io
        this.socket = io.connect('http://localhost:5000');
        //io.connect fires an event called connection in chat_sockets.js(server side), send the connect request to server(observer)

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established!');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chat_room: 'codial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined: ', data);
            });
        });

        $('#send-message').on('click', function(){
            let msg = $('#message-input').val();
            
            if(msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    chat_room: 'codial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);

            let messageType = 'other-message';
            if(data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            let newMessage = self.newMessageDom(messageType, data.message, data.user_name);

            $('#chat-message-list').append(newMessage);
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