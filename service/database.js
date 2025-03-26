const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('RankIt');
const userCollection = db.collection('users');

(async function connectionTest() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connected to the database`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

async function createUser(user) {
    await userCollection.insertOne(user);
}

function getUser(username) {
    return userCollection.findOne({ username: username });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function updateUser(user) {
    await userCollection.updateOne({ username: user.username }, { $set: user });
}

function getHighScores() {
    const query = { "stats.Total Points Scored": { $gt: 0 } };
    const options = {
        sort: { "stats.Total Points Scored": -1 },
        limit: 5,
        projection: {
            name: 1,
            "stats.Total Points Scored": 1,
        },
    };
    const cursor = userCollection.find(query, options);
    return cursor.toArray();
}

module.exports = {
    createUser,
    getUser,
    getUserByToken,
    updateUser,
    getHighScores,
};