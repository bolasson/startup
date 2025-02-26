import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

const dummyUserData = [
    { username: 'cs240' },
    { username: 'example' },
    { username: 'username' },
    { username: 'test' },
    { username: 'asdf' },
    { username: 'qwerty' },
    { username: 'password' },
    { username: 'admin' },
    { username: 'user' },
    { username: 'guest' },
];

export function GameProvider({ children }) {

    // Global state for the logged-in user
    const [user, setUser] = useState(null);

    // Global state for game details (e.g., game code, players)
    const [game, setGame] = useState({
        code: null,
        players: [],
    });

    // Global state for the leaderboard
    const [leaderboard, setLeaderboard] = useState([]);

    // Temporary data for database login replication 
    const [users, setUsers] = useState(dummyUserData);


    const [loginError, setLoginError] = useState(null);

    function validateCredentials(username, password) {
        if (!username) {
            return "A username is required.";
        }
        if (!password) {
            return "A password is required.";
        }
        const usernameRegex = /^[a-zA-Z0-9._]+$/;
        if (!usernameRegex.test(username)) {
            return "Username may only contain numbers, letters, periods, and/or underscores.";
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        }
        return null;
    }

    // Placeholder for logging in
    const login = (username, password) => {
        return new Promise((resolve) => {
            setLoginError(null);
            const validationError = validateCredentials(username, password);
            if (validationError) {
                setLoginError(validationError);
                resolve(false);
                return;
            } else if (users.some((u) => u.username === username)) {
                setLoginError("Username is already taken");
                resolve(false);
            } else {
                const newUser = { username };
                setUser(newUser);
                setUsers((prevUsers) => [...prevUsers, newUser]);
                setLoginError(null);
                resolve(true);
            }
        });
    };

    // Placeholder for creating a game
    const createGame = (gameCode) => {
        setGame({ code: gameCode, players: [user] });
    };

    const contextValue = {
        user,
        setUser,
        game,
        setGame,
        leaderboard,
        setLeaderboard,
        login,
        loginError,
        createGame,
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
