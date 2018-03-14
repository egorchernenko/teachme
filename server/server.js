const _ = require('lodash');

var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var ObjectID = require('mongodb');

var Todo = require('./models/todo');
var User = require('./models/user');
var authenticate = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

//post
app.post('/todos',authenticate, function (req,res) {
    console.log(req.body);

    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then(function (doc) {
        res.send(doc).sendStatus(200);
    }, function (err) {
        res.status(400).send(err);
    });

});

//get
app.get('/todos',authenticate,function (req,res) {
    console.log(req.user._id);
    Todo.find({
        _creator: req.user._id
    }).then(function (todos) {
        res.send({todos: todos});
    },function (err) {
        res.status(400).send(err);
    })
});

app.get('/todos/:id',authenticate, function (req,res) {
   var id = req.params.id;
    debugger;
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then(function (todo) {
        if (!todo){
            return res.sendStatus(404);
        }

        res.send(todo).status(200);
    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })

});

//delete
app.delete('/todos/:id',authenticate, function (req,res) {
    var id = req.params.id;

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
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
app.patch('/todos/:id',authenticate, function (req,res) {
    debugger;
   var id = req.params.id;
   var body = _.pick(req.body, ['text', 'completed']);

   if (_.isBoolean(body.completed) && body.completed){
       body.completedAt = new Date().getTime();
   }else{
       body.completed = false;
       body.completedAt = null;
   }


   Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then(function (todo) {
       if (!todo){
           return res.sendStatus(404);
       }

       res.send(todo).sendStatus(200);
   }).catch(function (reason) {
       res.send(reason).sendStatus(400);
   })
});


//USER post
//register
app.post('/users', function (req,res) {
   var body = _.pick(req.body, ['email','password']);
   var user = new User(body);

   user.save().then(function (user) {
       return user.generateAuthToken()
   }).then(function (token) {
       res.header('x-auth',token).send(user);
    }).catch(function (reason) {
       res.sendStatus(400).send(reason);
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

app.listen(port, function () {
    console.log(`Started on port ${port}`);
});

module.exports = app;
