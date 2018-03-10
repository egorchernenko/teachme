const ObjectID = require('mongodb');

const mongoose = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

var id = '5aa3cc76d92d511a1289ff73a';

 // if (!ObjectID(id).$isValid){
 //     console.log('Id not valid')
 // }
// Todo.find({
//     _id: id
// }).then(function (todos) {
//     console.log('Todos ', todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then(function (todo) {
//     console.log('Todo ', todo);
// });

// Todo.findById(id).then(function (todo) {
//     console.log('Todo ', todo);
// }).catch(function (reason) {
//     console.log(reason);
// });


 User.findById(id).then(function (user) {
     if (!user){
         return console.log('Unable to find user')
     }
     console.log(user)
 }).catch(function (reason) {
     console.log(reason)
 });