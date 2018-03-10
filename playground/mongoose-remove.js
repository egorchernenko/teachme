const ObjectID = require('mongodb');

const mongoose = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

// Todo.remove().then(function (res) {
//     console.log(res);
// });

Todo.findByIdAndRemove('5aa3e8ab66cd9e825b986646').then(function (todo) {
    console.log(todo)
});

Todo.findOneAndRemove({_id : '5aa3e8ab66cd9e825b986646'}).then(function (todo) {
    console.log(todo)
});