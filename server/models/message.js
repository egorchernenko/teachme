const mongoose = require('mongoose');
const Chat = require('./chat');
const User = require('./user');
const ObjectId = mongoose.Schema.Types.ObjectId;
var messageSchema = new mongoose.Schema({
    userId: {type: ObjectId, ref: 'User'},
    chatId: {type: ObjectId, ref: 'Chat'},
    name: {type: String, ref: 'Chat'},
    surname: {type: String, ref: 'Chat'},
    messageBody: {type: String, default: ''},
    timeStamp: {type: Date, default: Date.now}
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;