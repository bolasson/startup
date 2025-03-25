const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('RankIt');

async function connectionTest() {
    try {
        await db.command({ ping: 1 });
        console.log(`Connected to the database`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

async function addStaticUser() {
    try {
        const collection = db.collection('users');
        const user = {
            username: "test",
            password: "toomanysecrets",
            name: "Test",
            stats: {
                "Rounds Played": 0,
                "Total Points Scored": 0,
                "Date Joined": new Date().toLocaleDateString(),
                "Last Played": new Date().toLocaleDateString(),
            },
        };
        
        await collection.insertOne(user);
        const users = await collection.find({}).toArray();
        users.forEach(user => console.log(user));

        await closeConnection();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

async function closeConnection() {
    try {
        await client.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (e) {
        console.error('Error closing the connection:', e);
        process.exit(1);
    }
}

connectionTest();
addStaticUser();