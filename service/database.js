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

connectionTest();