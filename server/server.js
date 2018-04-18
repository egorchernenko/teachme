const _ = require('lodash');

var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var ObjectID = require('mongodb');

var Subject = require('./models/subject');
var User = require('./models/user');
var authenticate = require('./middleware/authenticate');

var app = express();

const http = require('http');
const socketIO = require('socket.io');
var server = http.createServer(app);
var io = socketIO(server);

var currentUser = null;

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//chat
app.get('/chat',authenticate, function (req,res) {
    currentUser = {name: req.user.name, surname: req.user.surname, email: req.user.email,id: req.user._id};
    res.sendFile( __dirname + '/chat.html');
});

io.on('connection', function(socket){
    socket.user= currentUser;

    socket.on('chat message', function(msg){
        console.log('User is ', socket.user);
        io.emit('chat message', {
            message: msg,
            user: currentUser,
            date: new Date()
    });
    });
});

//documentation
app.get('/',function (req,res) {
   res.sendFile( __dirname + '/index.html');
});

//SUBJECT particular user
//post

app.post('/subjects',authenticate, function (req,res) {
    var subject = new Subject({
        name: req.body.name,
        _teacher: req.user._id,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        teacherName: req.user.email,
        schedule: req.body.schedule
    });


    subject.save().then(function (doc) {
        res.send(doc).sendStatus(200);
    }, function (err) {
        res.status(400).send(err);
    }).catch(function (reason) {
        res.status(400);
    });

});

//get
app.get('/subjects',authenticate,function (req,res) {
    Subject.find({
        _teacher: req.user._id
    }).then(function (todos) {
        res.send({subjects: todos});
    },function (err) {
        res.status(400).send(err);
    })
});

//SUBJECT all users
app.get('/subjects/all', function (req,res) {

    Subject.find().then(function (subjects) {
        res.send({subjects: subjects});
    },function (err) {
        res.status(400).send(err);
    })
});

app.get('/subjects/search/:id',function (req, res) {

    var keyWord = req.params.id;

    Subject.find({ name: { "$regex": keyWord, "$options": "i" } }).then(function (subjects) {
        res.send({subjects: subjects});
    }).catch(function (reason) {
        res.sendStatus(404).send(reason);
    });
});

app.get('/subjects/category/:id',function (req, res) {

    var keyWord = req.params.id;

    Subject.find({ category: { "$regex": keyWord, "$options": "i" } }).then(function (subjects) {
        res.send({subjects: subjects});
    }).catch(function (reason) {
        res.sendStatus(404).send(reason);
    });
});



app.get('/subjects/categories',function (req,res) {

    res.send({categories: Subject.Categories}).sendStatus(200);
});

app.get('/subjects/:id',authenticate, function (req,res) {
   var id = req.params.id;

    Subject.findOne({
        _id: id,
        _teacher: req.user._id
    }).then(function (subject) {
        if (!subject){
            return res.sendStatus(404);
        }

        res.send(subject).status(200);
    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })

});

//delete
app.delete('/subjects/:id',authenticate, function (req,res) {
    var id = req.params.id;

    Subject.findOneAndRemove({
        _id: id,
        _teacher: req.user._id
    }).then(function (todo) {
        if (!todo){
            return res.sendStatus(404);
        }

        res.send(todo).status(200);
    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })
});

//update
app.patch('/subjects/:id',authenticate, function (req,res) {
   var id = req.params.id;
   var body = _.pick(req.body, ['name', 'description']);

   Subject.findOneAndUpdate({_id: id, _teacher: req.user._id}, {$set: body}, {new: true}).then(function (subject) {
       if (!subject){
           return res.sendStatus(404);
       }

       res.send(subject).sendStatus(200);
   }).catch(function (reason) {
       res.send(reason).sendStatus(400);
   })
});


//USER
//register
app.post('/users', function (req,res) {
   var body = _.pick(req.body, ['name','surname','email','password']);
   var user = new User(body);

   user.save().then(function (user) {
       return user.generateAuthToken()
   }).then(function (token) {
       res.header('x-auth',token).send(user);
    }).catch(function (reason) {
       res.status(400).send(reason);
   })
});

//get token
app.get('/users/me', authenticate, function (req,res) {
    res.send(req.user);
});

//login
app.post('/users/login',function (req,res) {
    var body = _.pick(req.body, ['email','password']);

    User.findByCredentials(body.email,body.password).then(function (user) {
        user.generateAuthToken().then(function (token) {
            res.header('x-auth',token).send(user)
        });

    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })
});

//sign out
app.delete('/users/me/token', authenticate, function (req,res) {
    req.user.removeToken(req.token).then(function () {
        res.sendStatus(200);
    }, function () {
        res.sendStatus(400);
    })
});

//add subjects
app.patch('/users/add/subject/:id',authenticate, function (req,res) {
    var id = req.params.id;

    Subject.findOne({_id:id}).then(function (subject) {

        subject.update({
            $inc: {numberOfStudent: 1 }
        }).then(function () {
            req.user.addSubject(subject).then(function () {
                res.sendStatus(200);
            })
        }).catch(function (reason) {
            res.send(reason).sendStatus(400);
        });



    }).catch(function (reason) {
        res.send(reason).sendStatus(400);
    });

});

app.get('/users/subjects/subscribed', authenticate, function (req,res) {

    res.send({subjects: req.user.mySubjects}).sendStatus(200);

});


//app.listen(port, function () {
//    console.log(`Started on port ${port}`);
//});

server.listen(port, function () {
    console.log(`Server is up on ${port}`);
});

module.exports = app;
