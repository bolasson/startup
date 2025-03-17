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

const port = process.argv.length > 2 ? process.argv[2] : 4000;

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
const authCookieName = 'authToken';
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
    { gameID: 1234, players: [
        { username: "lindsey", playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 1, isHost: true },
        { username: "kyle", playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 3, isHost: false },
        { username: "jessica", playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 6, isHost: false },
        { username: "nathan", playerID: 4, playerColor: "#ffff00", score: 0, activeVote: 3, isHost: false },
    ], currentRound: 0, currentItIndex: 0, clueTarget: 4, clue: '' },
    { gameID: 5678, players: [
        { username: "katelyn", playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 4, isHost: true },
        { username: "heidi", playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 8, isHost: false },
        { username: "travis", playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 5, isHost: false },
    ], currentRound: 0, currentItIndex: 0, clueTarget: 7, clue: '' },
];

dummyGamesData.forEach(game => {
    games.push(game);
});

/* AUTH & COOKIES */
// Helper functions
function setAuthCookie(res, user) {
    user.token = uuid.v4();

    res.cookie(authCookieName, user.token, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

const verifyAuth = async (req, res, next) => {
    const token = req.cookies[authCookieName];
    const user = await getUser(token, 'token');
    if (user) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

function clearAuthCookie(res, user) {
    delete user.token;
    res.clearCookie(authCookieName);
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
    const token = req.cookies[authCookieName];
    const user = await getUser(token, 'token');
    if (user) {
        clearAuthCookie(res, user);
    }
    res.status(204).send({ msg: 'Logged out' });
});

apiRouter.get('/user/me', async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await getUser(token, 'token');
    if (user) {
        res.send({ username: user.username, name: user.name, stats: user.stats });
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
});

/* GAME */
// Helper functions
function getGame(gameID) {
    return games.find((game) => game.gameID === gameID);
}

async function createGame() {
    let newGameID;
    do {
        newGameID = Math.floor(1000 + Math.random() * 9000);
    } while (getGame(newGameID));
    const game = {
        gameID: newGameID,
        players: [],
        currentRound: 1,
        currentItIndex: 0,
        clueTarget: Math.floor(Math.random() * 10) + 1,
        clue: '',
        createdAt: new Date().toLocaleDateString(),
        isStarted: false,
    };
    games.push(game);
    return game;
}

async function joinGame(gameID, user) {
    const game = getGame(gameID);
    if (game) {
        if (game.isStarted) {
            throw new Error('Game has already started');
        }
        if (game.players.some((player) => player.username === user.username)) {
            throw new Error('User is already in game');
        }
        if (game.players.length >= 8) {
            throw new Error('Game is full');
        } else {
            game.players.push({
                username: user.username,
                name: user.name,
                playerID: game.players.length + 1,
                playerColor: playerColors[game.players.length % playerColors.length],
                score: 0,
                activeVote: 0,
                isHost: game.players.length === 0,
            });
            return game;
        }
    } else {
        throw new Error('No game with ID ' + gameID + ' found');
    }
}

async function calculateScores(game) {
    if (!game) {
        throw new Error('No game provided to score');
    }
    const it = game.players[game.currentItIndex];
    game.players.forEach((player) => {
        const user = getUser(player.username);
        if (!user) {
            throw new Error(`User with username '${player.username}' not found`);
        }
        if (player !== it) {
            let score = 0;
            if (player.activeVote === game.clueTarget) {
                score = 3;
            } else if (player.activeVote === game.clueTarget + 1 || player.activeVote === game.clueTarget - 1) {
                score = 1;
            }
            player.score += score;
            user.stats["Total Points Scored"] += score;
        }
        user.stats["Rounds Played"] += 1;
    });
    return game;
}

async function startNextRound(gameID) {
    const game = getGame(gameID);
    if (!game) {
        throw new Error('No game with ID ' + gameID + ' found');
    }
    await calculateScores(game);
    game.currentRound += 1;
    game.currentItIndex = (game.currentItIndex + 1) % game.players.length;
    game.clueTarget = Math.floor(Math.random() * 10) + 1;
    game.clue = '';
    game.players.forEach((player) => {
        player.activeVote = 0;
    });
    return game;
}

// Endpoints
apiRouter.post('/game', verifyAuth, async (req, res) => {
    const game = await createGame();
    res.send(game);
});

apiRouter.get('/game', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.query.gameID);
    const game = getGame(gameID);
    if (game) {
        res.send(game);
    } else {
        res.status(404).send({ msg: 'Game not found' });
    }
});

apiRouter.put('/game/join', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.body.gameID);
    const user = await getUser(req.cookies[authCookieName], 'token');
    if (!user) {
        res.status(401).send({ msg: 'Unauthorized' });
    }
    try {
        const game = await joinGame(gameID, user);
        res.send(game);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});

apiRouter.put('/game/start', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.body.gameID);
    const game = getGame(gameID);
    if (!game) {
        res.status(404).send({ msg: 'Game not found' });
    } else {
        game.isStarted = true;
        res.send(game);
    }
});

apiRouter.put('/game/end-round', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.body.gameID);
    try {
        const game = await startNextRound(gameID);
        res.send(game);
    } catch (error) {
        res.status(400).send({ msg: error.message });
    }
});

apiRouter.put('/game/vote', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.body.gameID);
    const vote = parseInt(req.body.vote);
    const user = await getUser(req.cookies[authCookieName], 'token');
    const game = getGame(gameID);
    if (!game) {
        res.status(400).send({ msg: 'Game not found' });
    } else {
        const player = game.players.find((player) => player.username === user.username);
        if (!player) {
            res.status(400).send({ msg: 'User not in game' });
        } else {
            player.activeVote = vote;
            res.send(game);
        }
    }
});


/* PLAY */
// Helper functions
function updateGameVote(game, user, vote) {
    const player = game.players.find((player) => player.username === user.username);
    player.activeVote = vote;
}

function updateGameClue(game, clue) {
    game.clue = clue;
}

// Endpoints
apiRouter.put('/play/vote', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.body.gameID);
    const vote = parseInt(req.body.vote);
    const user = await getUser(req.cookies[authCookieName], 'token');
    const game = getGame(gameID);
    if (!game) {
        res.status(400).send({ msg: 'Game not found' });
    } else {
        updateGameVote(game, user, vote);
        res.send(game);
    }
});

apiRouter.put('/play/clue', verifyAuth, async (req, res) => {
    const gameID = parseInt(req.body.gameID);
    const clue = req.body.clue;
    const game = getGame(gameID);
    if (!game) {
        res.status(400).send({ msg: 'Game not found' });
    } else {
        updateGameClue(game, clue);
        res.send(game);
    }
});

// Game endpoints
apiRouter.post('/game/create', verifyAuth, async (req, res) => {
    const token = req.cookies[authCookieName];
    const user = await findUser(authCookieName, token);
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
    const user = await findUser(authCookieName, token);
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