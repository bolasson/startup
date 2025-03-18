import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {

    const [activeUser, setActiveUser] = useState(null);
    const [activeGame, setActiveGame] = useState();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setActiveUser(JSON.parse(user));
        }
        const game = localStorage.getItem('game');
        if (game) {
            setActiveGame(JSON.parse(game));
        }
    }, []);

    function setUser(user) {
        setActiveUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    function setGame(game) {
        setActiveGame(game);
        localStorage.setItem('game', JSON.stringify(game));
    }

    const contextValue = {
        activeUser,
        setUser,
        activeGame,
        setGame,
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