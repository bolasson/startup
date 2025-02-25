import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

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

    // Placeholder for logging in
    const login = (username) => {
        setUser({ username });
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
