import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();

const dummyUserData = [
    { userID: 5, username: 'guest', password: 'Gu3st!!!', name: 'Guest' },
    { userID: 6, username: 'cs240', password: 'Cs240!!!', name: 'CS 240' },
    { userID: 7, username: 'lindsey', password: 'Linds3y!', name: 'Lindsey' },
    { userID: 8, username: 'kyle', password: 'Kyl3!!!!', name: 'Kyle' },
    { userID: 9, username: 'jessica', password: 'J3ssica!', name: 'Jessica' },
    { userID: 10, username: 'nathan', password: 'N4than!!', name: 'Nathan' },
    { userID: 11, username: 'katelyn', password: 'K4telyn!', name: 'Katelyn' },
    { userID: 12, username: 'heidi', password: 'H3idi!!!', name: 'Heidi' },
    { userID: 13, username: 'travis', password: 'Tr4vis!!', name: 'Travis' },
];

const playerColors = ['#00D2FF', '#0FFF00', '#a545ff', '#ffff00', '#FF9200', '#FF00EC', '#665bff', '#FF0010'];

const dummyGamesData = [
    {
        gameID: 1234,
        players: [
            { userID: 5, playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 1, isHost: true },
            { userID: 7, playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 3, isHost: false },
            { userID: 9, playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 6, isHost: false },
            { userID: 11, playerID: 4, playerColor: "#ffff00", score: 0, activeVote: 3, isHost: false },
        ],
        currentRound: 1,
        currentItIndex: 0,
        clueTarget: 4,
        clue: '',
    },
    {
        gameID: 5678,
        players: [
            { userID: 6, playerID: 1, playerColor: "#00D2FF", score: 0, activeVote: 4, isHost: true },
            { userID: 7, playerID: 2, playerColor: "#0FFF00", score: 0, activeVote: 8, isHost: false },
            { userID: 8, playerID: 3, playerColor: "#a545ff", score: 0, activeVote: 5, isHost: false },
            { userID: 9, playerID: 4, playerColor: "#ffff00", score: 0, activeVote: 8, isHost: false },
        ],
        currentRound: 1,
        currentItIndex: 0,
        clueTarget: 7,
        clue: '',
    }
];

export function GameProvider({ children }) {

    const [users, setUsers] = useState(dummyUserData);
    const [activeUser, setActiveUser] = useState(null);
    const [games, setGames] = useState(dummyGamesData);
    const [activeGame, setActiveGame] = useState(dummyGamesData[0]);

    function getNextUserID() {
        const highestUserID = users.reduce((maxID, user) => Math.max(maxID, user.userID), 0);
        return highestUserID + 1;
    }

    function getUser(userID) {
        return users.find((u) => u.userID === userID);
    };

    function createUser(username, password, name) {
        return fetch('/api/auth/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password, name }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => ({ error: data.msg }));
                }
                return response.json()
                    .then((data) => {
                        setActiveUser({ userID: data.userID, username: data.username, name: data.name });
                        addUser({ userID: data.userID, username: data.username, name: data.name });
                        return { success: 'New user created' };
                    });
            })
            .catch((error) => ({ error: error.message }));
    }

    function loginUser(username, password) {
        return fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => ({ error: data.msg }));
                }
                return response.json().then((data) => {
                    setActiveUser({ userID: data.userID, username: data.username, name: data.name });
                    addUser({ userID: data.userID, username: data.username, name: data.name });
                    return { success: 'Login successful' };
                });
            })
            .catch((error) => ({ error: error.message }));
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

    const createGame = useCallback(() => {
        return fetch('/api/game/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => ({ error: data.msg }));
                }
                return response.json().then(newGame => {
                    setActiveGame(newGame);
                    addGame(newGame);
                    return { success: `Created new game with ID ${newGame.gameID}`, game: newGame };
                });
            })
            .catch(error => ({ error: error.message }));
    }, [setActiveGame]);

    const joinGame = useCallback((gameID, user) => {
        return new Promise((resolve) => {
            const game = games.find((g) => g.gameID === gameID);
            if (game) {
                const newPlayer = {
                    userID: user.userID,
                    playerID: game.players.length + 1,
                    playerColor: playerColors[game.players.length],
                    score: 0,
                    activeVote: 0,
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
            setActiveGame(game);
        }
    }

    function startNextGameRound(gameID) {
        const game = games.find((g) => g.gameID === gameID);
        if (game) {
            game.currentRound = game.currentRound + 1;
            game.clueTarget = Math.floor(Math.random() * 10) + 1;
            game.currentItIndex = (game.currentItIndex + 1) % game.players.length;
            game.clue = "";
            game.players.forEach((player) => {
                if (player.userID === game.players[game.currentItIndex].userID) {
                    player.activeVote = game.clueTarget;
                } else {
                    // placeholder to simulate random votes
                    player.activeVote = Math.floor(Math.random() * 10) + 1;
                }
            });
            updateGame(game);
            setActiveGame(game);
        }
    }

    function submitClue(gameID, clue) {
        const game = games.find((g) => g.gameID === gameID);
        if (!game) return;
        const updatedGame = { ...game, clue };
        updateGame(updatedGame);
        setActiveGame(updatedGame);
    }

    function submitVote(gameID, userID, voteValue) {
        const game = games.find((g) => g.gameID === gameID);
        if (!game) return;
        const updatedPlayers = game.players.map((player) => {
            if (player.userID === userID) {
                return { ...player, activeVote: voteValue };
            }
            return player;
        });
        const updatedGame = { ...game, players: updatedPlayers };
        updateGame(updatedGame);
        setActiveGame(updatedGame);
    }

    function scoreVotes(gameID) {
        const game = games.find((g) => g.gameID === gameID);
        if (!game) return;
        const itPlayer = game.players[game.currentItIndex];
        const correctVote = itPlayer.activeVote;
        const scores = {};
        game.players.forEach((player) => {
            if (player.userID === itPlayer.userID) {
                scores[player.userID] = 0;
            } else {
                const voteDifference = Math.abs(correctVote - player.activeVote);
                if (voteDifference === 0) {
                    scores[player.userID] = 3;
                } else if (voteDifference === 1) {
                    scores[player.userID] = 1;
                } else {
                    scores[player.userID] = 0;
                }
            }
        });
        updateGameScores(gameID, scores);
        startNextGameRound(gameID);
        return scores;
    }

    function submitScore(score) {
        return fetch('/api/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ score }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => ({ error: data.msg }));
                }
                return response.json().then(updatedStats => {
                    setActiveUser(prevUser => ({
                        ...prevUser,
                        stats: updatedStats,
                    }));
                    return { success: 'Player stats updated', stats: updatedStats };
                });
            })
            .catch(error => ({ error: error.message }));
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
        submitVote,
        submitClue,
        scoreVotes,
        submitScore,
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

    if (password.length < 12) {
        return "Password must be at least 12 characters long.";
    }

    return null;
}