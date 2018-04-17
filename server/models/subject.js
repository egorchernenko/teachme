var mongoose = require('mongoose');

var SubjectShema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        default: 0
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
var Subject = mongoose.model('Subject', SubjectShema);
var Categories = Object.freeze(["Программирование","Бизнес","Маркетинг","Дизайн","Языки","Точные наук","Садовоство","Строительство"]);



module.exports = Subject;
module.exports.Categories = Categories;
