import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

const dummyUserData = [
    { userID: 0, username: 'guest', password: 'Gu3st!!!', name: 'Guest' },
    { userID: 1, username: 'cs240', password: 'Cs240!!!', name: 'CS 240' },
    { userID: 2, username: 'lindsey', password: 'Linds3y!', name: 'Lindsey' },
    { userID: 3, username: 'kyle', password: 'Kyl3!!!!', name: 'Kyle' },
    { userID: 4, username: 'jessica', password: 'J3ssica!', name: 'Jessica' },
    { userID: 5, username: 'nathan', password: 'N4than!!', name: 'Nathan' },
    { userID: 6, username: 'katelyn', password: 'K4telyn!', name: 'Katelyn' },
    { userID: 7, username: 'heidi', password: 'H3idi!!!', name: 'Heidi' },
    { userID: 8, username: 'travis', password: 'Tr4vis!!', name: 'Travis' },
];

const playerColors = ['#00D2FF', '#0FFF00', '#a545ff', '#ffff00', '#FF9200', '#FF00EC', '#665bff', '#FF0010'];

const dummyGamesData = [
    {
        gameID: 1234,
        players: [
            { userID: 1, playerID: 1, playerColor: "#00D2FF", score: 0, isHost: true },
            { userID: 3, playerID: 2, playerColor: "#0FFF00", score: 0, isHost: false },
            { userID: 5, playerID: 3, playerColor: "#a545ff", score: 0, isHost: false },
            { userID: 7, playerID: 4, playerColor: "#ffff00", score: 0, isHost: false },
        ],
        currentRound: 1,
        currentItIndex: 0,
        clueTarget: 4
    },
    {
        gameID: 5678,
        players: [
            { userID: 2, playerID: 1, playerColor: "#FF9200", score: 0, isHost: true },
            { userID: 4, playerID: 2, playerColor: "#FF00EC", score: 0, isHost: false },
            { userID: 6, playerID: 3, playerColor: "#665bff", score: 0, isHost: false },
            { userID: 8, playerID: 4, playerColor: "#FF0010", score: 0, isHost: false },
        ],
        currentRound: 1,
        currentItIndex: 0,
        clueTarget: 7
    }
];

export function GameProvider({ children }) {

    const [users, setUsers] = useState(dummyUserData);

    const [activeGame, setActiveGame] = useState(dummyGamesData[0]);
    const [games, setGames] = useState(dummyGamesData);

    // Global state for the logged-in user
    const [activeUser, setActiveUser] = useState(users[0]);

    function getNextUserID() {
        const highestUserID = users.reduce((maxID, user) => Math.max(maxID, user.userID), 0);
        return highestUserID + 1;
    }

    function getUser (userID) {
        return users.find((u) => u.userID === userID);
    };

    function createUser(username, password, name) {
        return new Promise((resolve) => {

            if (users.some((u) => u.username === username)) {
                return resolve({ error: "Username is already taken" });
            }

            const validationError = validateCredentials(username, password, name);

            if (validationError) {
                return resolve({ error: validationError });
            } else {
                const newUserID = getNextUserID();
                const newUser = { userID: newUserID, username: username.toLowerCase(), password: password, name: name };
                setActiveUser(newUser);
                addUser(newUser);
                return resolve({ success: "New user created" });
            }
        });
    }

    function loginUser(username, password) {
        return new Promise((resolve) => {
            const user = users.find((u) => u.username === username.toLowerCase() && u.password === password);
            if (user) {
                setActiveUser(user);
                addUser(user);
                return resolve({ success: "Login successful" });
            } else {
                return resolve({ error: "Invalid credentials" });
            }
        });
    }

    function addUser(user) {
        if (users.some((u) => u.username === user.username)) {
            return;
        }
        setUsers((prevUsers) => [...prevUsers, user]);
    }

    function deleteUser(username = null, userID = null) {
        if (username) {
            setUsers((prevUsers) => prevUsers.filter((u) => u.username !== username.toLowerCase()));
        } else if (userID) {
            setUsers((prevUsers) => prevUsers.filter((u) => u.userID !== userID));
        }
    }

    function getNewGameID() {
        let newGameID;
        do {
            newGameID = Math.floor(1000 + Math.random() * 9000);
        } while (games.some((game) => game.gameID === newGameID));
        return newGameID;
    }

    const createGame = useCallback((host) => {
        return new Promise((resolve) => {
            if (!host) {
                return resolve({ error: "You must be signed in to host a game." });
            }
            const newGameID = getNewGameID();
            const newGame = {
                gameID: newGameID,
                players: [
                    { userID: host.userID, playerID: 1, playerColor: playerColors[0], score: 0, isHost: true }
                ],
                currentRound: 0,
                currentItIndex: 0,
                clueTarget: Math.floor(Math.random() * 10) + 1
            };
            setActiveGame(newGame);
            addGame(newGame);
            return resolve({ success: `Created new game with ID ${newGameID}`, gameID: newGameID });
        });
    });

    const joinGame = useCallback((gameID, user) => {
        return new Promise((resolve) => {
            const game = games.find((g) => g.gameID === gameID);
            if (game) {
                const newPlayer = {
                    userID: user.userID,
                    playerID: game.players.length + 1,
                    playerColor: playerColors[game.players.length],
                    score: 0,
                    isHost: false
                };
                if (game.players.some((p) => p.userID === newPlayer.userID)) {
                    return resolve({ warning: "User is already in the game" });
                }
                if (game.players.length >= 8) {
                    return resolve({ warning: "Game is full" });
                }
                const updatedGame = {
                    ...game,
                    players: [...game.players, newPlayer]
                };
                updateGame(updatedGame);
                setActiveGame(updatedGame);
                return resolve({ success: `Joined game with ID ${game.gameID}`, gameID: game.gameID });
            } else {
                return resolve({ error: "Game not found" });
            }
        });
    });

    function leaveGame(gameID, userID) {
        return new Promise((resolve) => {
            const game = games.find((g) => g.gameID === gameID);
            if (game) {
                game.players = game.players.filter((p) => p.userID !== userID);
                updateGame(game);
                setActiveGame(null);
                resolve({ success: `Left Game ${game.gameID}` });
            } else {
                resolve({ error: "Game not found" });
            }
        });
    }

    function addGame(game) {
        if (games.some((g) => g.gameID === game.gameID)) {
            return;
        }
        setGames((prevGames) => [...prevGames, game]);
    }

    function deleteGame(gameID) {
        setGames((prevGames) => prevGames.filter((g) => g.gameID !== gameID));
    }

    function updateGame(updatedGame) {
        setGames((prevGames) => prevGames.map((g) => g.gameID === updatedGame.gameID ? updatedGame : g));
    }

    const getGameUsers = useCallback((gameID) => {
        const game = games.find((g) => g.gameID === gameID);
        if (game) {
            return game.players;
        } else {
            return [];
        }
    });


    function getGameScores(gameID) {
        const game = games.find((g) => g.gameID === gameID);
        if (game) {
            const playerScores = [];
            game.players.forEach((player) => {
                const name = users.find((u) => u.userID === player.userID).name;
                const playerScore = { name: name, score: player.score, color: player.playerColor };
                playerScores.push(playerScore);
            });
            return playerScores;
        }
        return {};
    }

    function updateGameScores(gameID, scores) {
        const game = games.find((g) => g.gameID === gameID);
        if (game) {
            game.players.forEach((player) => {
                player.score += scores[player.userID] || 0;
            });
            updateGame(game);
        }
    }

    function startNextGameRound(gameID) {
        const game = games.find((g) => g.gameID === gameID);
        if (game) {
            game.currentRound = game.currentRound + 1;
            game.clueTarget = Math.floor(Math.random() * 10) + 1;
            game.currentItIndex = (game.currentItIndex + 1) % game.players.length;
            updateGame(game);
        }
    }

    const contextValue = {
        activeUser,
        users,
        dummyUserData,
        getUser,
        createUser,
        loginUser,
        deleteUser,
        activeGame,
        games,
        dummyGamesData,
        createGame,
        joinGame,
        leaveGame,
        deleteGame,
        getGameScores,
        getGameUsers,
        updateGameScores,
        startNextGameRound,
    };

    return (
        <GameContext.Provider value={contextValue}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}

function validateCredentials(username, password, name) {

    if (!username) {
        return "A username is required.";
    }

    if (!password) {
        return "A password is required.";
    }

    if (!name) {
        return "Your name is required.";
    }

    const nameRegex = /^[a-zA-Z0-9._]+$/;
    if (!nameRegex.test(name)) {
        return "Display name may only contain numbers, letters, periods, and/or underscores.";
    }

    if (!nameRegex.test(username)) {
        return "Username may only contain numbers, letters, periods, and/or underscores.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    return null;
}