import React from 'react';

const playerColors = [
    '#00D2FF',
    '#0FFF00',
    '#a545ff',
    '#ffff00',
    '#FF9200',
    '#FF00EC',
    '#665bff',
    '#FF0010',
];

export default function PlayerList({ players }) {
    return (
        <ul style={{ width: '75%', padding: 0, marginBlock: '1rem' }}>
            {players.map((player, index) => (
                <li
                    key={index}
                    style={{
                        background: playerColors[index % playerColors.length],
                        padding: '0.25rem 1rem',
                        margin: '0.5rem 0',
                        listStyle: 'none',
                    }}
                >
                    {player.username ? player.username : player}
                </li>
            ))}
        </ul>
    );
}