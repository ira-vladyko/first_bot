const { MongoClient } = require('mongodb')
const { mongoUrl, dbName } = require('./config')

const client = new MongoClient(mongoUrl);

const db = client.db(dbName);
const usersCollection = db.collection('users');

async function connectToDB() {
    return client.connect()
}

async function disconnectDB() {
    return client.lose()
}

module.exports = {
    connectToDB,
    disconnectDB,
    usersCollection
}

