import React, { useEffect, useState } from 'react';
import { useGame } from '../customContext/gameContext.jsx';

export default function Leaderboard() {
    const { activeGame, getGameScores } = useGame();
    const [scores, setScores] = useState([]);

    useEffect(() => {
        if (activeGame) {
            const gameScores = getGameScores(activeGame.gameID);
            const sortedScores = [...gameScores].sort((a, b) => b.score - a.score);
            setScores(sortedScores);
        }
    }, [activeGame, getGameScores]);

    return (
        <aside className="leaderboard">
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
        </aside>
    );
}