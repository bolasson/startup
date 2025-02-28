import { useState, useCallback } from 'react';
import { useGame } from '../customContext/gameContext.jsx';

const predefinedHost = { username: 'Bryce' };
const playerColors = ['#00D2FF', '#0FFF00', '#a545ff', '#ffff00', '#FF9200', '#FF00EC', '#665bff', '#FF0010'];

export default function useGameLogic() {
    const { user, game, setGame, usersToGames, setUsersToGames, leaderboard, setLeaderboard } = useGame();
    const [isProcessing, setIsProcessing] = useState(false);

    // Create a game and initialize round management.
    const createGame = useCallback((gameID = 0) => {
        
        setIsProcessing(true);
        
        let gameCode;
        do {
            gameCode = gameID != 0 ? gameID : Math.floor(1000 + Math.random() * 9000).toString();
        } while (usersToGames[gameCode]);

        const hostSource = (user && gameID == 0) ? user : predefinedHost;
        const hostUser = {
            playerID: 1,
            username: `${hostSource.username}`,
            gameID: gameCode,
            playerColor: playerColors[0],
            score: 0,
            isHost: true,
        };

        const newGame = {
            code: gameCode,
            clueTarget: Math.floor(Math.random() * 10) + 1,
            currentRound: 1,
            currentItIndex: 0,
            players: [hostUser],
        };

        setUsersToGames((prev) => ({
            ...prev,
            [gameCode]: hostUser ? [hostUser] : [],
        }));

        setGame(newGame);
        setIsProcessing(false);

        return gameCode;
    }, [user, setGame]);

    const gameExists = useCallback((gameID) => {
        return Boolean(game && game.code === gameID);
    }, [game]);

    // Simulate joining an existing game by verifying the code and adding the new player.
    // const joinGame = useCallback((gameID, newPlayer, assignedPlayerID=0) => {

    //     setIsProcessing(true);

    //     const currentPlayers = usersToGames[gameID] || [];
    //     const playerID = assignedPlayerID != 0 ? assignedPlayerID : getNextPlayerID(gameID);
    //     const playerObj = {
    //         gameID: gameID,
    //         username: newPlayer.username,
    //         playerID: playerID,
    //         playerColor: playerColors[playerID-1],
    //         score: 0,
    //         isHost: false,
    //     };

    //     setUsersToGames((prev) => {
    //         const existing = prev[gameID] || [];

    //         if (!existing.some((p) => p.username === playerObj.username)) {
    //             return {
    //                 ...prev,
    //                 [gameID]: [...existing, playerObj],
    //             };
    //         }
    //         return prev;
    //     });

    //     if (game && game.code === gameID) {
    //         setGame({ ...game, players: [...(game.players || []), playerObj] });
    //     }

    //     setIsProcessing(false);

    // }, [game, setGame]);

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

            updateLeaderboard(game.code);

            setIsProcessing(false);
        }, 500);
    };

    const updateLeaderboard = (gameID) => {
        const players = usersToGames[gameID] || [];
        const newLeaderboard = players.map((player) => {
            return { username: player.username, score: player.score, color: player.playerColor };
        });
        setLeaderboard(newLeaderboard);
    };

    const getConnectedUsers = useCallback((gameID) => {
        return new Promise((resolve) => {
            resolve(usersToGames[gameID] || []);
        });
    }, [usersToGames]);

    const getNextPlayerID = useCallback((gameID) => {
        const players = usersToGames[gameID] || [];
        let highestID = 0;
        for (let player of players) {
            if (player.playerID > highestID) {
                highestID = player.playerID;
            }
        }
        return highestID + 1;
    }, [game]);

    return { createGame, gameExists, getConnectedUsers, joinGame, processVotes, nextRound, isProcessing };
}
