const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var subject = require('./subject');

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        default: null
    },
    mySubjects: [{
      type: subject.schema
    }],
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]

});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(),access: access}, 'abc123').toString();//secret value
    user.tokens = user.tokens.concat([{access: access, token: token}]);
    return user.save().then(function () {
        return token;
    });

};

UserSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });

};

UserSchema.methods.addSubject = function (subject) {
    var user = this;

    return user.update({
       $push : {
           mySubjects: subject
        }
    });

};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
      decoded = jwt.verify(token, 'abc123');
  } catch (err){
      return Promise.reject();
  }

  return User.findOne({
      _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;

    return User.findOne({email: email}).then(function (user) {
       if (!user){
           Promise.reject();
       }

       return new Promise(function (resolve,reject) {
          bcrypt.compare(password,user.password, function (error, res) {
              if (res){
                  resolve(user);
              } else {
                  reject();
              }
          })
       });
    });
};

UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')){
        bcrypt.genSalt(10, function (error,salt) {
           bcrypt.hash(user.password,salt,function (error2, hash) {
              user.password = hash;
              next()
           });
        });

    } else {
        next();
    }

});

var User = mongoose.model('User', UserSchema);

module.exports = User;