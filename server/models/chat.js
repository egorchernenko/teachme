const mongoose = require('mongoose');
const user = require('./user');
const ObjectId = mongoose.Schema.Types.ObjectId;

var chatSchema = new mongoose.Schema({
    user1: {
        _id: {type: ObjectId, ref: 'User'},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    },
    user2: {
        _id: {type: ObjectId, ref: 'User'},
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    }
});

var Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;


