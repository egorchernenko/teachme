//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err,client) {
   if (err){
    return console.log('Unable to connect to mongodb server');
   }
   console.log('Conntected to Mongo DB');
   const db = client.db('TodoApp');

   // db.collection('Todos').insertOne({
   //     text: 'Some new text',
   //     completed: true
   // }, function (err,result){
   //     if (err){
   //         return console.log('Unable to insert todo ',err)
   //     }
   //
   //     console.log(JSON.stringify(result.ops, undefined, 2));
   // });

    // db.collection('Users').insertOne({
    //     name: 'NameB',
    //     age: 19,
    //     location: 'Ukraine'
    // }, function (err,result){
    //     if (err){
    //         return console.log('Unable to insert insert ',err)
    //     }
    //
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

   client.close();

});