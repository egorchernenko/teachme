//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err,client) {
    if (err){
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Conntected to Mongo DB');
    const db = client.db('TodoApp');


    // //deleteMany
    // db.collection('Todos').deleteMany({text: 'Edit lunch'}).then(function (res) {
    //     console.log(res);
    // });
    //
    //
    // //deleteOne
    // db.collection('Todos').deleteOne({text: 'Code'}).then(function (res) {
    //     console.log(res);
    // });

    //findOneAndDelete

    db.collection('Todos').findOneAndDelete({completed: true}).then(function (res) {
        console.log(res);
    })

    //client.close();
});