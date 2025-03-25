const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('RankIt');
const userCollection = db.collection('users');
const gameCollection = db.collection('games');

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
    return userCollection.findOne(
        { username: username },
        { projection: { password: 0 } }
    );
}

function getUserByToken(token) {
    return userCollection.findOne(
        { token: token },
        { projection: { password: 0 } }
    );
}

async function updateUser(user) {
    await userCollection.updateOne({ username: user.username }, { $set: user });
}

async function createGame(game) {
    await gameCollection.insertOne(game);
}

function getGame(gameID) {
    return gameCollection.findOne({ gameID: gameID });
}

async function updateGame(game) {
    await gameCollection.updateOne({ gameID: game.gameID }, { $set: game });
}

async function deleteGame(gameID) {
    await gameCollection.deleteOne({ gameID: gameID });
}

function getHighScores() {
    const query = { "stats.Total Points Scored": { $gt: 0 } };
    const options = {
        sort: { "stats.Total Points Scored": -1 },
        limit: 5,
        projection: {
            username: 1,
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
    createGame,
    getGame,
    updateGame,
    deleteGame,
    getHighScores,
};