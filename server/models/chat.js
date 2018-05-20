const mongoose = require('mongoose');
const user = require('./user');
var subject = require('./subject')
const ObjectId = mongoose.Schema.Types.ObjectId;

var chatSchema = new mongoose.Schema({
    user1: {
        _id: {type: ObjectId, ref: 'User'},
        email: {type: String, ref: 'User'},
        name: {type: String, ref: 'User'},
        surname: {type: String, ref: 'User'},
        mySubjects: {type: [subject.schema], ref: 'User'},
        imagePath: {type: String, ref: 'User'}
    },
    user2: {
        _id: {type: ObjectId, ref: 'User'},
        email: {type: String, ref: 'User'},
        name: {type: String, ref: 'User'},
        surname: {type: String, ref: 'User'},
        mySubjects: {type: [subject.schema], ref: 'User'},
        imagePath: {type: String, ref: 'User'}
    }
});

var Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;


