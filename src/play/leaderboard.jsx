import React, { useEffect, useState } from 'react';

export default function Leaderboard({game}) {
    const [scores, setScores] = useState([]);

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
                    {scores.length ? (
                        scores.slice(0, 5).map((player, index) => (
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