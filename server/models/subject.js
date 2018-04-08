var mongoose = require('mongoose');

var Subject = mongoose.model('Subject', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: false
    },
    numberOfStudent:{
        type: Number,
        default: 0
    },
    schedule: {
        type: [{day: String, start: String, end: String}],
    },
    comments: {
        type: [{author: String, body: String}],
    },
    teacherName:{
        type: String,
        default: "Name unavailable"
    },
    _teacher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

});

module.exports = Subject;