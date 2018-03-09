var mongoose = require('mongoose');

var User = mongoose.model('User',{
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    age: {
        type: Number,
    }

});

module.exports = User;