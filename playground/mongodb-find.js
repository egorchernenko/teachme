//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err,client) {
    if (err){
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Conntected to Mongo DB');
    const db = client.db('TodoApp');

    //  db.collection('Todos').find({
    //      _id: new ObjectID('5aa2531b1ed2900e5ae6232f')
    //  }).toArray().then( function (docs) {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // }, function (err) {
    //     if (err){
    //         console.log('Unable to fetch todos ', err);
    //     }
    // });

    db.collection('Todos').find().count().then( function (count) {
        console.log('Todos count: ',count);
    }, function (err) {
        if (err){
            console.log('Unable to fetch todos ', err);
        }
    });

    db.collection('Users').find({
        name: 'Yehor'
    }).toArray().then( function (docs) {
        console.log('Todos');
        console.log(JSON.stringify(docs,undefined,2));
    }, function (err) {
        if (err){
            console.log('Unable to fetch todos ', err);
        }
    });

    //client.close();
});