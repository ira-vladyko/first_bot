const { usersCollection } = require('./mongoDB')
const { connectToDB, disconnectDB } = require('./mongoDB');

const connectToStorage = async () => {
    console.log('trying to connect')
    await connectToDB()
    console.log('sucssesful connected')
}

const disconnectStorage = async () => {
    await disconnectDB()
}

const saveUser = async (user) => {
    const userInDb = await usersCollection.findOne({ id: user.id })
    if (!userInDb) {
        await usersCollection.insertOne(user)
        console.log('Saved user to db', user.username)
    } else {
        if (Object.keys(user).every(key => userInDb[key] === user[key])) {
            console.log('User already exists in db')
        } else {
            await usersCollection.updateOne({ _id: userInDb._id }, { $set: user })
            console.log('User updated in db')
        }
    }
}



module.exports = {
    saveUser,
    connectToStorage,
    disconnectStorage
}