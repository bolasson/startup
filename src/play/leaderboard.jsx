import React from 'react';
import { useGame } from '../customContext/gameContext.jsx';

export default function Leaderboard() {
    const { leaderboard } = useGame();

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
                    {leaderboard.length ? (
                        leaderboard.slice(0, 5).map((player, index) => (
                            <tr key={index}>
                                <td>
                                    <li style={{ color: player.color, background: 'none', padding: '0rem', listStyle: 'none' }}>
                                        {player.username}
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
