var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Make a shit'
});

newTodo.save().then(function (doc) {
    console.log('Save new todo ', doc);
},function (err) {
    console.log('Unable to save todo ', err);
});

var otherTodo = new Todo({
    text: 'Make a shit',
    completed: true
});

otherTodo.save().then(function (doc) {
    console.log('Save new todo ', doc);
},function (err) {
    console.log('Unable to save todo ', err);
});