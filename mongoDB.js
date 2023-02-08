const { MongoClient } = require('mongodb')
const { mongoUrl, dbName } = require('./config')

const client = new MongoClient(mongoUrl);

const db = client.db(dbName);
const usersCollection = db.collection('users');

module.exports = {
    connectToDB: () => client.connect(),
    disconnectDB: () => client.close(),
    usersCollection
}

