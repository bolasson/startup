import React from 'react';
import { useGame } from '../customContext/gameContext.jsx';

export default function PlayerVotes({ players }) {
    const voteValues = Array.from({ length: 10 }, (_, i) => i + 1);

    const votesByValue = voteValues.map(value =>
        players.filter(player => player.activeVote === value)
    );

    const maxRows = Math.max(...votesByValue.map(arr => arr.length), 0);

    return (
        <div className="player-votes-container">
            <table className="player-votes">
                <tbody>
                    {Array.from({ length: maxRows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {voteValues.map((value, colIndex) => {
                                const columnVotes = votesByValue[colIndex];
                                const count = columnVotes.length;
                                const voteIndex = rowIndex - (maxRows - count);
                                let content = null;
                                if (voteIndex >= 0 && voteIndex < count) {
                                    const player = columnVotes[voteIndex];
                                    const playerName = player?.name || "?";
                                    content = (
                                        <div
                                            style={{
                                                background: player.playerColor,
                                                borderRadius: '4px',
                                                padding: '2px 4px',
                                                margin: '2px auto',
                                                color: '#000',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {playerName.charAt(0)}
                                        </div>
                                    );
                                }
                                return (
                                    <td
                                        key={colIndex}
                                        style={{
                                            verticalAlign: 'bottom',
                                            textAlign: 'center',
                                            padding: '4px',
                                            height: '30px'
                                        }}
                                    >
                                        {content}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    <tr>
                        {voteValues.map((value, index) => (
                            <td
                                key={index}
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    padding: '4px'
                                }}
                            >
                                {value}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
