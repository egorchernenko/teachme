var User = require('./../models/user')

var authenticate = function (req,res,next) {
    var token = req.header('x-auth');

    User.findByToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWNjYzY5Y2MwMmIwYTI5NmZlZDBlMjIiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTIzMzY5NjI4fQ.YURttK8JLaqPXcWsYfkoF6soZynTMEE3BSPiI6uaQW0').then(function (user) {
        if (!user){
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next()
    }).catch(function (reason) {
        res.sendStatus(401).send()
    });
};

module.exports = authenticate;