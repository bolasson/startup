const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');

// Data storage
let users = [];
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
        setAuthCookie(res, user.token);
        return res.send({
            userID: user.userID,
            username: user.username,
            name: user.name,
        });
    }
    return res.status(401).send({ msg: 'Invalid Credentials' });
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