import { useState, useCallback } from 'react';
import { useGame } from '../customContext/gameContext.jsx';

export default function useGameLogic() {
    const { user, game, setGame, leaderboard, setLeaderboard } = useGame();
    const [isProcessing, setIsProcessing] = useState(false);

    // Create a game and initialize round management.
    const createGame = useCallback(() => {
        
        setIsProcessing(true);
        
        const gameCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        const newGame = {
            code: gameCode,
            players: user ? [user] : [],
            clueTarget: Math.floor(Math.random() * 10) + 1,
            currentRound: 1,
            currentItIndex: 0,
        };

        setTimeout(() => {
            setGame(newGame);
            setIsProcessing(false);
        }, 1000);
        
        return gameCode;
    }, [user, setGame]);

    // Simulate joining an existing game by verifying the code and adding the new player.
    const joinGame = (code, newPlayer) => {

        setIsProcessing(true);

        setTimeout(() => {
            if (game && game.code === code) {
                setGame({ ...game, players: [...game.players, newPlayer] });
            }
            setIsProcessing(false);
        }, 1000);
    };

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

    return { createGame, joinGame, processVotes, nextRound, isProcessing };
}
