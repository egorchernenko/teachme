var express = require('express');
var router = express.Router();
var Subject = require('../models/subject');
var User = require('../models/subject');
const _ = require('lodash');
var authenticate = require('../middleware/authenticate');


router.post('/',authenticate, function (req,res) {
    var subject = new Subject({
        name: req.body.name,
        _teacher: req.user._id,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        teacherName: req.user.email,
        schedule: req.body.schedule
    });


    subject.save().then(function (doc) {
        res.send(doc).sendStatus(200);
    }, function (err) {
        res.status(400).send(err);
    }).catch(function (reason) {
        res.status(400);
    });

});

//get subject created by this user
router.get('/',authenticate,function (req,res) {
    Subject.find({
        _teacher: req.user._id
    }).then(function (todos) {
        res.send({subjects: todos});
    },function (err) {
        res.status(400).send(err);
    })
});

//SUBJECT all users
router.get('/all', function (req,res) {

    Subject.find().then(function (subjects) {
        res.send({subjects: subjects});
    },function (err) {
        res.status(400).send(err);
    })
});

router.get('/search/:id',function (req, res) {

    var keyWord = req.params.id;

    Subject.find({ name: { "$regex": keyWord, "$options": "i" } }).then(function (subjects) {
        res.send({subjects: subjects});
    }).catch(function (reason) {
        res.sendStatus(404).send(reason);
    });
});

router.get('/category/:id',function (req, res) {

    var keyWord = req.params.id;

    Subject.find({ category: { "$regex": keyWord, "$options": "i" } }).then(function (subjects) {
        res.send({subjects: subjects});
    }).catch(function (reason) {
        res.sendStatus(404).send(reason);
    });
});



router.get('/categories',function (req,res) {

    res.send({categories: Subject.Categories}).sendStatus(200);
});

router.get('/:id',authenticate, function (req,res) {
    var id = req.params.id;

    Subject.findOne({
        _id: id,
        _teacher: req.user._id
    }).then(function (subject) {
        if (!subject){
            return res.sendStatus(404);
        }

        res.send(subject).status(200);
    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })

});

//delete
router.delete('/:id',authenticate, function (req,res) {
    var id = req.params.id;

    Subject.findOneAndRemove({
        _id: id,
        _teacher: req.user._id
    }).then(function (todo) {
        if (!todo){
            return res.sendStatus(404);
        }

        res.send(todo).status(200);
    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })
});

//update
router.patch('/:id',authenticate, function (req,res) {
    var id = req.params.id;
    var body = _.pick(req.body, ['name', 'description']);

    Subject.findOneAndUpdate({_id: id, _teacher: req.user._id}, {$set: body}, {new: true}).then(function (subject) {
        if (!subject){
            return res.sendStatus(404);
        }

        res.send(subject).sendStatus(200);
    }).catch(function (reason) {
        res.send(reason).sendStatus(400);
    })
});

module.exports = router;
