import React from "react";
import "../styles.css";

function PointsSection({ label, players }) {
    return (
        <div className="points-section">
            <p className="points-label">{label}:</p>
            <div style={{ flexWrap: "wrap"}}>
                {players.map((player, index) => (
                    <p key={index} className="player-icon" style={{ backgroundColor: player.playerColor }} >
                        {player.name}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default function Results(props) {
    const { clueGiver, clue, clueTarget, lowerScale, upperScale, players } = props.resultsProps;
    const playersByPointsScored = {
        "+3 Points": [],
        "+1 Point": [],
        "No Points": []
    };

    players?.forEach(player => {
        if (player.username === clueGiver.username) return;
        if (player.activeVote === clueTarget) {
            playersByPointsScored["+3 Points"].push(player);
        } else if (player.activeVote === clueTarget - 1 || player.activeVote === clueTarget + 1) {
            playersByPointsScored["+1 Point"].push(player);
        } else {
            playersByPointsScored["No Points"].push(player);
        }
    });

    return (
        <section className="results">
            <h2 className="results-header">
                On a scale of <strong>{lowerScale}</strong> to <strong>{upperScale}</strong>,{" "}
                <i>{clueGiver?.name}</i> thought <strong>{clue}</strong> should be a{" "}
                <strong>{clueTarget}</strong>.
            </h2>
            <div className="results-content">
                {Object.entries(playersByPointsScored).map(([label, players]) => (
                    <><hr /><PointsSection key={label} label={label} players={players} /></>
                ))}    
            </div>
        </section>
    );
}