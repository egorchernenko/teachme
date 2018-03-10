var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var ObjectID = require('mongodb');

var Todo = require('./models/todo');
var User = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;


app.use(bodyParser.json());

//post
app.post('/todos',function (req,res) {
    console.log(req.body);

    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(function (doc) {
        res.sendStatus(200);
    }, function (err) {
        res.status(400).send(err);
    });

});

//get
app.get('/todos',function (req,res) {
    Todo.find().then(function (todos) {
        res.send({todos});
    },function (err) {
        res.status(400).send(err);
    })
});

app.get('/todos/:id', function (req,res) {
   var id = req.params.id;

    Todo.findById(id).then(function (todo) {
        if (!todo){
            return res.sendStatus(404);
        }

        res.send(todo).status(200);
    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })

});





app.listen(port, function () {
    console.log(`Started on port ${port}`);
});

module.exports = app;
