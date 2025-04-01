import React, { useEffect, useState } from 'react';

export default function Leaderboard({game}) {
    const [scores, setScores] = useState([]);

    const dummyScores = [
        { name: 'Player 1', score: 10, color: 'red' },
        { name: 'Player 2', score: 9, color: 'blue' },
        { name: 'Player 3', score: 5, color: 'green' },
        { name: 'Player 4', score: 7, color: 'purple' },
        { name: 'Player 5', score: 6, color: 'orange' },
        { name: 'Player 6', score: 7, color: 'brown' },
        { name: 'Player 7', score: 5, color: 'white' },
        { name: 'Player 8', score: 5, color: 'pink' }
    ]

    useEffect(() => {
        if (game) {
            const gameScores = game.players.map(player => ({
                name: player.name,
                score: player.score,
                color: player.playerColor
            }));
            const sortedScores = [...gameScores].sort((a, b) => b.score - a.score);
            setScores(sortedScores);
        }
    }, [game]);

    dummyScores.sort((a, b) => b.score - a.score);

    return (
        <section>
            <h2>Leaderboard</h2>
            <table className="rounded-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {dummyScores.length ? (
                        dummyScores.slice(0, 5).map((player, index) => (
                            <tr key={index}>
                                <td>
                                    <li
                                        style={{
                                            color: player.color,
                                            background: 'none',
                                            padding: '0',
                                            listStyle: 'none'
                                        }}
                                    >
                                        {player.name}
                                    </li>
                                </td>
                                <td>{player.score}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" style={{ textAlign: 'center' }}>No scores yet</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
}