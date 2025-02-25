import React from 'react';
import { useGame } from '../customContext/gameContext.jsx';
import useGameLogic from '../customHooks/useGameLogic.jsx';

export default function Dev() {

    const { user, game, leaderboard } = useGame();
    const { createGame, joinGame, processVotes, nextRound, isProcessing } = useGameLogic();

    const sampleVotes = [
        { username: 'Alice', voteValue: game ? game.clueTarget : 5 },
        { username: 'Bob', voteValue: game ? game.clueTarget + 1 : 6 },
        { username: 'Charlie', voteValue: game ? game.clueTarget - 1 : 4 },
    ];

    return (
        <div>
            <div className="button-group" style={{ marginBottom: '1rem' }}>
                <button onClick={createGame}>Create Game</button>
                <button onClick={() => joinGame(game ? game.code : '0000', { username: 'TestUser' })}>
                    Join Game as TestUser
                </button>
                <button onClick={() => processVotes(sampleVotes)}>
                    Process Sample Votes
                </button>
                <button onClick={nextRound}>Next Round</button>
            </div>
            {isProcessing && <p>Processing...</p>}
            <div className="game-state" style={{ marginTop: '1rem' }}>
                <h3>Current Game State:</h3>
                <pre>{JSON.stringify(game, null, 2)}</pre>
            </div>
            <div className="leaderboard-state" style={{ marginTop: '1rem' }}>
                <h3>Leaderboard:</h3>
                <pre>{JSON.stringify(leaderboard, null, 2)}</pre>
            </div>
        </div>
    );
}
