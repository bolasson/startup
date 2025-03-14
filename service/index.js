const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');

// Data storage
let users = [];
let games = [];
const authCookieName = 'authToken';

const app = express();

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(express.static('public'));

// Default route
// app.get('*', (_req, res) => {
//     res.send({ msg: 'Backend service is running.' });
// });

// Helper functions
function setAuthCookie(res, token) {
    res.cookie(authCookieName, token, {
        secure: false,
        httpOnly: true,
        sameSite: 'strict',
    });
}

const verifyAuth = async (req, res, next) => {
    const token = req.cookies[authCookieName];
    if (!token) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }
    const user = await findUser('token', token);
    if (user) {
        next();
    } else {
        return res.status(401).send({ msg: 'Unauthorized' });
    }
};

async function findUser(field, value) {
    if (!value) return null;
    return users.find((u) => u[field] === value);
}

// Router setup
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Login endpoints
apiRouter.post('/auth/create', async (req, res) => {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).send({ msg: 'Missing required fields.' });
    }

    const lowercaseUsername = username.toLowerCase();

    const existingUser = await findUser('username', lowercaseUsername);
    if (existingUser) {
        return res.status(409).send({ msg: 'Username is already taken' });
    }

    if (password.length < 12) {
        return res.status(400).send({ msg: 'Password must be at least 12 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
        userID: users.length > 0 ? users[users.length - 1].userID + 1 : 1,
        username: lowercaseUsername,
        password: passwordHash,
        name,
        token: uuid.v4(),
        stats: {
            "Rounds Played": 0,
            "Total Points Scored": 0,
            "Date Joined": new Date().toLocaleDateString(),
            "Last Played": new Date().toLocaleDateString(),
        },
    };

    users.push(newUser);
    setAuthCookie(res, newUser.token);
    res.send({ userID: newUser.userID, username: newUser.username, name: newUser.name });
});

apiRouter.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ msg: 'Missing required fields: username and password.' });
    }

    const lowercaseUsername = username.toLowerCase();
    const user = await findUser('username', lowercaseUsername);

    if (user && await bcrypt.compare(password, user.password)) {
        user.token = uuid.v4();
        if (user.stats) {
            user.stats["Last Played"] = new Date().toLocaleDateString();
        }
        setAuthCookie(res, user.token);
        return res.send({
            userID: user.userID,
            username: user.username,
            name: user.name,
        });
    }
    return res.status(401).send({ msg: 'Invalid Credentials' });
});

// Stats endpoints
apiRouter.get('/stats', verifyAuth, async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (!user) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }
    res.send(user.stats);
});

apiRouter.post('/score', verifyAuth, async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (!user) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }

    const { score } = req.body;
    if (typeof score !== 'number') {
        return res.status(400).send({ msg: 'Score must be a number' });
    }
    if (!user.stats) {
        user.stats = {
            "Rounds Played": 0,
            "Total Points Scored": 0,
            "Date Joined": new Date().toLocaleDateString(),
            "Last Played": new Date().toLocaleDateString(),
        };
    }
    user.stats["Rounds Played"] += 1;
    user.stats["Total Points Scored"] += score;
    res.send(user.stats);
});

// Game endpoints
apiRouter.post('/game/create', verifyAuth, async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (!user) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }

    let newGameID;
    do {
        newGameID = Math.floor(1000 + Math.random() * 9000);
    } while (games.some(game => game.gameID === newGameID));

    const newGame = {
        gameID: newGameID,
        host: user.userID,
        players: [
            { userID: user.userID, playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 1, isHost: true }
        ],
        currentRound: 0,
        currentItIndex: 0,
        clueTarget: Math.floor(Math.random() * 10) + 1,
        clue: ''
    };

    games.push(newGame);
    res.send(newGame);
});

app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ type: err.name, message: err.message });
});

app.listen(port, () => {
    console.log(`Backend service listening on port ${port}`);
});