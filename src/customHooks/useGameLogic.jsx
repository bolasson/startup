import { useState, useCallback } from 'react';
import { useGame } from '../customContext/gameContext.jsx';

const predefinedHost = { username: 'Bryce' };

export default function useGameLogic() {
    const { user, game, setGame, usersToGames, setUsersToGames, leaderboard, setLeaderboard } = useGame();
    const [isProcessing, setIsProcessing] = useState(false);

    // Create a game and initialize round management.
    const createGame = useCallback((gameId = 0) => {
        setIsProcessing(true);
        const gameCode = gameId != 0 ? gameId : Math.floor(1000 + Math.random() * 9000).toString();

        const newGame = {
            code: gameCode,
            clueTarget: Math.floor(Math.random() * 10) + 1,
            currentRound: 1,
            currentItIndex: 0,
        };

        const hostUser = (user && gameId == 0) ?
            { ...user, username: `${user.username} (Host)` } :
            { ...user, username: `${predefinedHost.username} (Host)` };

        setUsersToGames((prev) => ({
            ...prev,
            [gameCode]: hostUser ? [hostUser] : [],
        }));

        setGame(newGame);
        setIsProcessing(false);

        return gameCode;
    }, [user, setGame]);

    const gameExists = useCallback((gameId) => {
        return Boolean(game && game.code === gameId);
    }, [game]);

    // Simulate joining an existing game by verifying the code and adding the new player.
    const joinGame = useCallback((gameId, newPlayer) => {

        setIsProcessing(true);

        setUsersToGames((prev) => {
            const existing = prev[gameId] || [];

            if (!existing.some((p) => p.username === newPlayer.username)) {
                return {
                    ...prev,
                    [gameId]: [...existing, newPlayer],
                };
            }
            return prev;
        });

        if (game && game.code === gameId) {
            setGame({ ...game, players: [...(game.players || []), newPlayer] });
        }

        setIsProcessing(false);

    }, [game, setGame]);

    // Process all votes once every player (except the clue giver) has voted.
    // Each vote object is expected to be: { username, voteValue }
    const processVotes = (votes) => {

        setIsProcessing(true);

        setTimeout(() => {
            setLeaderboard((prev) => {
                const updated = [...prev];
                const target = game.clueTarget || 5;
                votes.forEach(({ username, voteValue }) => {
                    let points = 0;
                    if (voteValue === target) {
                        points = 3;
                    } else if (Math.abs(voteValue - target) === 1) {
                        points = 1;
                    }
                    const index = updated.findIndex((player) => player.username === username);
                    if (index !== -1) {
                        updated[index].points += points;
                    } else {
                        updated.push({ username, points });
                    }
                });
                return updated;
            });
            setIsProcessing(false);
        }, 1000);
    };

    // Advance to the next round:
    // - Increment the round counter.
    // - Rotate the "it" player (by updating currentItIndex).
    // - Update the clueTarget to a new random value.
    // This simulates that each round a new clue giver is chosen and a new target is set.
    const nextRound = () => {

        setIsProcessing(true);

        setTimeout(() => {

            setGame((prevGame) => {
                if (!prevGame || !prevGame.players || prevGame.players.length === 0) return prevGame;
                const numPlayers = prevGame.players.length;
                const newRound = (prevGame.currentRound || 1) + 1;
                const newItIndex = (prevGame.currentItIndex + 1) % numPlayers;
                return {
                    ...prevGame,
                    currentRound: newRound,
                    currentItIndex: newItIndex,
                    clueTarget: Math.floor(Math.random() * 10) + 1,
                };
            });

            setIsProcessing(false);
        }, 500);
    };

    const getConnectedUsers = useCallback((gameId) => {
        return new Promise((resolve) => {
            resolve(usersToGames[gameId] || []);
        });
    }, [usersToGames]);

    return { createGame, gameExists, getConnectedUsers, joinGame, processVotes, nextRound, isProcessing };
}
