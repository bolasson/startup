const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');

// Data storage
let users = [];
let games = [];
const authCookieName = 'authToken';
const playerColors = ['#00D2FF', '#0FFF00', '#a545ff', '#ffff00', '#FF9200', '#FF00EC', '#665bff', '#FF0010'];

// Dummy data until websocket is implemented
const dummyUserData = [
    { userID: 7, username: 'lindsey', password: 'Linds3y!', name: 'Lindsey' },
    { userID: 8, username: 'kyle', password: 'Kyl3!!!!', name: 'Kyle' },
    { userID: 9, username: 'jessica', password: 'J3ssica!', name: 'Jessica' },
    { userID: 10, username: 'nathan', password: 'N4than!!', name: 'Nathan' },
    { userID: 11, username: 'katelyn', password: 'K4telyn!', name: 'Katelyn' },
    { userID: 12, username: 'heidi', password: 'H3idi!!!', name: 'Heidi' },
    { userID: 13, username: 'travis', password: 'Tr4vis!!', name: 'Travis' },
];

dummyUserData.forEach(user => {
    user.password = bcrypt.hashSync(user.password, 10);
    users.push(user);
});

const dummyGamesData = [
    { gameID: 1234, players: [
            { userID: 5, playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 1, isHost: true },
            { userID: 7, playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 3, isHost: false },
            { userID: 9, playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 6, isHost: false },
            { userID: 11, playerID: 4, playerColor: "#ffff00", score: 0, activeVote: 3, isHost: false },
        ], currentRound: 1, currentItIndex: 0, clueTarget: 4, clue: '',
    },
    { gameID: 5678, players: [
            { userID: 12, playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 4, isHost: true },
            { userID: 7, playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 8, isHost: false },
            { userID: 8, playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 5, isHost: false },
            { userID: 9, playerID: 4, playerColor: "#ffff00", score: 0, activeVote: 8, isHost: false },
        ], currentRound: 1, currentItIndex: 0, clueTarget: 7, clue: '',
    }
];

dummyGamesData.forEach(game => {
    games.push(game);
});

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

apiRouter.post('/game/join', verifyAuth, async (req, res) => {
    const { gameID } = req.body;
    const token = req.cookies[authCookieName];
    const user = await findUser('token', token);
    if (!user) {
        return res.status(401).send({ msg: 'Unauthorized' });
    }

    const game = games.find(g => g.gameID === gameID);
    if (!game) {
        return res.status(404).send({ msg: 'Game not found' });
    }

    if (game.players.some(p => p.userID === user.userID)) {
        return res.status(400).send({ error: "User is already in the game", game });
    }

    if (game.players.length >= 8) {
        return res.status(400).send({ error: "Game is full" });
    }

    const newPlayer = {
        userID: user.userID,
        playerID: game.players.length + 1,
        playerColor: playerColors[game.players.length % playerColors.length],
        score: 0,
        activeVote: 0,
        isHost: false
    };

    game.players.push(newPlayer);
    res.send(game);
});

apiRouter.post('/game/join/dummy', verifyAuth, async (req, res) => {
    const { gameID } = req.body;
    const game = games.find(g => g.gameID === gameID);
    if (!game) {
        return res.status(404).send({ msg: 'Game not found' });
    }

    const availableDummy = dummyUserData.find(
        (dummy) => !game.players.some(p => p.userID === dummy.userID)
    );

    if (game.players.length >= 8) {
        return res.status(400).send({ msg: 'Game is full' });
    }

    if (!availableDummy) {
        return res.status(400).send({ msg: 'No available dummy users to add.' });
    }

    const newPlayer = {
        userID: availableDummy.userID,
        playerID: game.players.length + 1,
        playerColor: playerColors[game.players.length % playerColors.length],
        score: 0,
        activeVote: 0,
        isHost: false,
    };

    game.players.push(newPlayer);
    res.send(game);
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