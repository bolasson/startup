import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {

    const [activeUser, setActiveUser] = useState(null);
    const [activeGame, setActiveGame] = useState();

    function setUser(user) {
        setActiveUser(user);
    }

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

    const joinGame = useCallback((gameID) => {
        return fetch('/api/game/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameID })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => ({ error: data.msg || data.warning }));
                }
                return response.json().then(updatedGame => {
                    setActiveGame(updatedGame);
                    return { success: `Joined game with ID ${updatedGame.gameID}`, game: updatedGame };
                });
            })
            .catch(error => ({ error: error.message }));
    }, [setActiveGame]);

    const joinDummyGame = useCallback((gameID) => {
        return fetch('/api/game/join/dummy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ gameID }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => ({ error: data.msg || data.warning }));
                }
                return response.json().then(updatedGame => {
                    setActiveGame(updatedGame);
                    return { success: `Dummy user added to game ${updatedGame.gameID}`, game: updatedGame };
                });
            })
            .catch(error => ({ error: error.message }));
    }, [setActiveGame]);

    // function startNextGameRound(gameID) {
    //     const game = games.find((g) => g.gameID === gameID);
    //     if (game) {
    //         game.currentRound = game.currentRound + 1;
    //         game.clueTarget = Math.floor(Math.random() * 10) + 1;
    //         game.currentItIndex = (game.currentItIndex + 1) % game.players.length;
    //         game.clue = "";
    //         game.players.forEach((player) => {
    //             if (player.userID === game.players[game.currentItIndex].userID) {
    //                 player.activeVote = game.clueTarget;
    //             } else {
    //                 // placeholder to simulate random votes
    //                 player.activeVote = Math.floor(Math.random() * 10) + 1;
    //             }
    //         });
    //         updateGame(game);
    //         setActiveGame(game);
    //     }
    // }

    // function submitClue(gameID, clue) {
    //     const game = games.find((g) => g.gameID === gameID);
    //     if (!game) return;
    //     const updatedGame = { ...game, clue };
    //     updateGame(updatedGame);
    //     setActiveGame(updatedGame);
    // }

    // function submitVote(gameID, userID, voteValue) {
    //     const game = games.find((g) => g.gameID === gameID);
    //     if (!game) return;
    //     const updatedPlayers = game.players.map((player) => {
    //         if (player.userID === userID) {
    //             return { ...player, activeVote: voteValue };
    //         }
    //         return player;
    //     });
    //     const updatedGame = { ...game, players: updatedPlayers };
    //     updateGame(updatedGame);
    //     setActiveGame(updatedGame);
    // }

    // function scoreVotes(gameID) {
    //     const game = games.find((g) => g.gameID === gameID);
    //     if (!game) return;
    //     const itPlayer = game.players[game.currentItIndex];
    //     const correctVote = itPlayer.activeVote;
    //     const scores = {};
    //     game.players.forEach((player) => {
    //         if (player.userID === itPlayer.userID) {
    //             scores[player.userID] = 0;
    //         } else {
    //             const voteDifference = Math.abs(correctVote - player.activeVote);
    //             if (voteDifference === 0) {
    //                 scores[player.userID] = 3;
    //             } else if (voteDifference === 1) {
    //                 scores[player.userID] = 1;
    //             } else {
    //                 scores[player.userID] = 0;
    //             }
    //         }
    //     });
    //     updateGameScores(gameID, scores);
    //     startNextGameRound(gameID);
    //     return scores;
    // }

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
        setUser,
        getUser,
        createUser,
        loginUser,
        deleteUser,
        activeGame,
        createGame,
        joinGame,
        joinDummyGame,
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