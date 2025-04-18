import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
    const [activeUser, setActiveUser] = useState(null);
    const [activeGame, setActiveGame] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setActiveUser(JSON.parse(storedUser));
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