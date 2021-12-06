// CRUD

const { ObjectID } = require('bson')
const { MongoClient } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'anyPageIntoALesson'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log("Unable to connect to the database")
  }

  const db = client.db(databaseName)

  db.collection('questions').updateMany( { points: 0 },
   {
     $inc: {
       points: 1
     }
   }
  ).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })
})
