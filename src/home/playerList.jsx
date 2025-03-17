import React from 'react';
import { useGame } from '../customContext/gameContext.jsx';

export default function PlayerList({ players }) {
    return (
        <ul style={{ width: '75%', padding: 0, marginBlock: '1rem' }}>
            {players.map((player, index) => (
                <li
                    key={index}
                    style={{
                        background: player.playerColor,
                        padding: '0.25rem 1rem',
                        margin: '0.5rem 0',
                        listStyle: 'none',
                    }}
                >
                    {player.name + (player.isHost ? " (Host)" : "")}
                </li>
            ))}
        </ul>
    );
}