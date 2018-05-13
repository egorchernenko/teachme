const mongoose = require('mongoose');
const chat = require('./chat');

var messageSchema = new mongoose.Schema({
    chat: chat.schema,
    messageBody: String, default: "",
    timeStamp: {type: Date, default: Date.now},
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;