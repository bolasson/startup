const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Data storage
let users = [];
/* User Structure
    { username: string, password: string, name: string, stats: Stats, token: uuid }
    // Stats structure: 
    { roundsPlayed: int, pointsScored: int, dateJoined: date, lastPlayed: date }
*/
let games = [];
/* Game Structure
    { gameID: int, players: player[], currentRound: int, currentItIndex: int, clueTarget: int, clue: string }
    // Player structure:
    { username: string, playerID: int, playerColor: string, score: int, activeVote: int, isHost: bool }
*/
const authCookieName = 'token';
const playerColors = ['#00D2FF', '#0FFF00', '#a545ff', '#ffff00', '#FF9200', '#FF00EC', '#665bff', '#FF0010'];

// Dummy data until websocket is implemented
const dummyUserData = [
    { username: 'lindsey', password: 'Linds3y!', name: 'Lindsey' },
    { username: 'kyle', password: 'Kyl3!!!!', name: 'Kyle' },
    { username: 'jessica', password: 'J3ssica!', name: 'Jessica' },
    { username: 'nathan', password: 'N4than!!', name: 'Nathan' },
    { username: 'katelyn', password: 'K4telyn!', name: 'Katelyn' },
    { username: 'heidi', password: 'H3idi!!!', name: 'Heidi' },
    { username: 'travis', password: 'Tr4vis!!', name: 'Travis' },
];

dummyUserData.forEach(user => {
    user.password = bcrypt.hashSync(user.password, 10);
    users.push(user);
});

const dummyGamesData = [
    {
        gameID: 1234, players: [
            { username: "lindsey", playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 1, isHost: true },
            { username: "kyle", playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 3, isHost: false },
            { username: "jessica", playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 6, isHost: false },
            { username: "nathan", playerID: 4, playerColor: "#ffff00", score: 0, activeVote: 3, isHost: false },
        ], currentRound: 0, currentItIndex: 0, clueTarget: 4, clue: '',
    },
    {
        gameID: 5678, players: [
            { username: "katelyn", playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 4, isHost: true },
            { username: "heidi", playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 8, isHost: false },
            { username: "travis", playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 5, isHost: false },
        ], currentRound: 0, currentItIndex: 0, clueTarget: 7, clue: '',
    }
];

dummyGamesData.forEach(game => {
    games.push(game);
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Default route
// app.get('*', (_req, res) => {
//     res.send({ msg: 'Backend service is running.' });
// });

// Helper functions
// function setAuthCookie(res, token) {
//     res.cookie(authCookieName, token, {
//         secure: false,
//         httpOnly: true,
//         sameSite: 'strict',
//     });
// }

async function findUser(field, value) {
    if (!value) return null;
    return users.find((u) => u[field] === value);
}

/* AUTH & COOKIES */
// Helper functions
function setAuthCookie(res, user) {
    user.token = uuid.v4();

    res.cookie('token', user.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

const verifyAuth = async (req, res, next) => {
    const user = await findUser(req.cookies['token'], 'token');
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

function clearAuthCookie(res, user) {
    delete user.token;
    res.clearCookie('token');
}

/* USER */
// Helper functions
function getUser(value, field = "username") {
    if (value) {
        return users.find((user) => user[field] === value);
    }
    return null;
}

async function passwordMeetsRequirements(password) {
    return password.length >= 12;
}

async function usernameMeetsRequirements(username) {
    return username.length >= 6;
}

async function createUser(username, password, name) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
        username: username,
        password: passwordHash,
        name: name || username,
        stats: {
            "Rounds Played": 0,
            "Total Points Scored": 0,
            "Date Joined": new Date().toLocaleDateString(),
            "Last Played": new Date().toLocaleDateString(),
        },
    };
    users.push(user);
    return user;
}

async function setLastPlayed(user) {
    user.stats["Last Played"] = new Date().toLocaleDateString();
}

// Endpoints
apiRouter.post('/user', async (req, res) => {
    if (await getUser(req.body.username)) {
        res.status(409).send({ msg: 'Username already taken.' });
    } else if (!await usernameMeetsRequirements(req.body.username)) {
        res.status(400).send({ msg: 'Username must be at least 6 characters long.' });
    } else if (!await passwordMeetsRequirements(req.body.password)) {
        res.status(400).send({ msg: 'Password must be at least 12 characters long.' });
    } else {
        const user = await createUser(req.body.username, req.body.password, req.body.name);
        setAuthCookie(res, user);
        res.send({ username: user.username, name: user.name, stats: user.stats });
    }
});

apiRouter.put('/user', async (req, res) => {
    const user = await getUser(req.body.username);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        setAuthCookie(res, user);
        await setLastPlayed(user);
        res.send({ username: user.username, name: user.name, stats: user.stats });
    } else {
        res.status(401).send({ msg: 'Please check your credentials' });
    }
});

apiRouter.delete('/user', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser(token, 'token');
    if (user) {
        clearAuthCookie(res, user);
    }
    res.status(204).send({ msg: 'Logged out' });
});

apiRouter.get('/user/me', async (req, res) => {
    const token = req.cookies['token'];
    const user = await getUser(token, 'token');
    if (user) {
        res.send({ username: user.username, name: user.name, stats: user.stats });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

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