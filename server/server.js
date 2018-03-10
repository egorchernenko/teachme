var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');

var Todo = require('./models/todo');
var User = require('./models/user');


var app = express();
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







app.listen(3000, function () {
    console.log('Started on port 3000');
});

module.exports = app;
