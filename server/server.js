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


app.post('/chat/create', authenticate, function (req,res) {

    User.findById(req.body._id).then(function (user) {
        if (!user){
            res.send(404);
        }

        var newChat = new Chat({
            user1: {
                _id: req.user.id,
                name: req.user.name + ' ' + req.user.surname,
                image: req.user.name + '.jpg'
            },
            user2: {
                _id: user._id,
                name: user.name + ' ' + user.surname,
                image: user.name + '.jpg'
            }
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
                res.sendStatus(400);
            } else {
                newChat.save().then(function () {
                    res.sendStatus(200);
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

module.exports = app;
