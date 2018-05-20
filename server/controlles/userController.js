var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Subject = require('../models/subject');
var authenticate = require('../middleware/authenticate');
var bodyParser = require('body-parser');
const _ = require('lodash');

//saving photo to data base
var multer = require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.user._id + '.jpg')
    }
});

var upload = multer({ storage: storage }).single('avatar');

router.post('/uploadPhoto',authenticate, upload,function (req,res) {
    User.findOne(req.user).then(function (user) {
        user.update({
            $set: {
                imagePath: 'avatar' + '-' + user._id + '.jpg'
            }
        }).then(function () {
            res.send({imagePath: 'avatar' + '-' + user._id + '.jpg'});
        }).catch(function (reason) {
            res.sendStatus(404);
        })
    }).catch(function (reason) {
        res.sendStatus(400);
    })
});

router.get('/avatar/:id',function (req,res) {

    var imagePath = req.params.id;
    var imageData= fs.readFileSync('./uploads/'+ imagePath);
    res.send(imageData);
});

//register
router.post('/', function (req,res) {
    var body = _.pick(req.body, ['name','surname','email','password']);
    var user = new User(body);

    user.save().then(function (user) {
        return user.generateAuthToken()
    }).then(function (token) {
        res.header('x-auth',token).send(user);
    }).catch(function (reason) {
        res.status(400).send(reason);
    })
});

//get token
router.get('/me', authenticate, function (req,res) {
    res.send(req.user);
});

//login
router.post('/login',function (req,res) {
    var body = _.pick(req.body, ['email','password']);

    User.findByCredentials(body.email,body.password).then(function (user) {
        user.generateAuthToken().then(function (token) {
            res.header('x-auth',token).send(user)
        });

    }).catch(function (reason) {
        res.sendStatus(400).send(reason);
    })
});

//sign out
router.delete('/me/token', authenticate, function (req,res) {
    req.user.removeToken(req.token).then(function () {
        res.sendStatus(200);
    }, function () {
        res.sendStatus(400);
    })
});

//add subjects
//not working
router.patch('/add/subject/:id',authenticate, function (req,res) {
    var id = req.params.id;

    Subject.findOne({_id:id}).then(function (subject) {

        subject.update({
            $inc: {numberOfStudents: 1 }
        }).then(function () {
            req.user.addSubject(subject).then(function () {
                res.sendStatus(200);
            })
        }).catch(function (reason) {
            res.send(reason).sendStatus(400);
        });



    }).catch(function (reason) {
        res.send(reason).sendStatus(400);
    });

});

router.get('/subjects/subscribed', authenticate, function (req,res) {

    res.send({subjects: req.user.mySubjects}).sendStatus(200);

});

router.get('/byId/:id', function (req, res) {
   var id = req.params.id;

   User.findOne({_id: id}).then(function (user) {
       res.send(user).status(200);
   }).catch(function () {
       res.status(400);
   })
});

module.exports = router;