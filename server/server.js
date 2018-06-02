var bodyParser = require('body-parser');
var express = require('express');

var mongoose = require('./db/mongoose');
var ObjectID = require('mongodb');

var Subject = require('./models/subject');
var User = require('./models/user');
var Chat = require('./models/chat');
var Message = require('./models/message');
var authenticate = require('./middleware/authenticate');

var userController = require('./controlles/userController');
var subjectController = require('./controlles/subjectController');
var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/users',userController);
app.use('/subjects',subjectController);


const http = require('http');
const socketIO = require('socket.io');
var server = http.createServer(app);
var io = socketIO(server);


io.on('connection', function (socket) {
    console.log('user connected');

    socket.on('newMessage',function (messageBody, userId, chatId, userName, userImagePath) {
        console.log(messageBody);

        var newMessage = new Message({
            userId: userId,
            chatId: chatId,
            name: userName,
            imagePath: userImagePath,
            messageBody: messageBody
        });

        newMessage.save(function (err,msg) {
            console.log('message sent');

            io.emit('messageCreated', msg.messageBody, msg.userId, msg.chatId, msg.name, msg.imagePath,msg.timeStamp)
        });
    });
    
    
    socket.on('outgoingCall', function (chanelId, userId) {

        User.findOne({_id: userId}).then(function (user) {

            io.emit('incomingCall', chanelId, user.name, user.surname, user.imagePath,user._id)
        }).catch();
    });

    
});


app.post('/chat/create', authenticate, function (req,res) {

    User.findById(req.body._id).then(function (user) {
        if (!user){
            res.send(404);
        }

        var newChat = new Chat({
            user1: req.user.toJSON(),
            user2: user.toJSON()

        });

        Chat.find({$or: [{
                user1: newChat.user1,
                user2: newChat.user2
            },
                {
                user1: newChat.user2,
                user2: newChat.user1
                }
            ]
        }).then(function (chat) {
            if (chat.length > 0){
                res.json(chat[0]).status(200);
            } else {
                newChat.save().then(function () {
                    res.json(newChat).status(200);
                }).catch(function (reason) {
                    res.send(reason).sendStatus(409);
                })
            }

        }).catch(function (reason) {
            res.sendStatus(400);
        });

    }).catch(function (reason) {
        res.status(400).send(reason);
    })
});

app.get('/chat/myChats',authenticate, function (req,res) {

        Chat.find({$or: [{
                user1: req.user.toJSON(),
            }, {
                user2: req.user.toJSON(),
                }
            ]
        }).then(function (chats) {
            res.json({chats: chats}).status(200);
        }).catch(function (reason) {
            res.sendStatus(400);
        });

});

app.get('/chat/allMessages/:id',authenticate, function (req,res) {
   let chatId = req.params.id;

    Message.find({chatId: chatId}).then(function (messages) {
        res.json({messages: messages});
    }).catch(function () {
        res.status(400);
    })
});


//documentation
app.get('/',function (req,res) {
   res.sendFile( __dirname + '/index.html');
});



//app.listen(port, function () {
//    console.log(`Started on port ${port}`);
//});

server.listen(port, function () {
    console.log(`Server is up on ${port}`);
});

module.exports = { app, io };
