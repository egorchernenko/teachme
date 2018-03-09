//const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err,client) {
    if (err){
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Conntected to Mongo DB');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5aa25bd51ed2900e5ae624dd')
    // }, {
    //     $set: {
    //         completed: false
    //     }
    // },{
    //     returnOrigianl: false
    // }).then(function (value) {
    //     console.log(value);
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5aa2504d3af6ee09dff43ba7')
    },{
      $set:{
          name: 'Boss'
      },
      $inc:{
          age: 1
      }
    }).then(function (value) {
        console.log(value)
    })
    //client.close();
});