import React from "react";
import "../styles.css";

export default function SubmitClue({ clueInput, setClueInput, handleClueSubmit, activeGame }) {    
    return (
        <section className="transparent-form">
            <h2 className="play-header">
                For a scale of <strong>{activeGame?.lowerScale}</strong> to <strong>{activeGame?.upperScale}</strong>, submit a clue to help players guess the number <strong>{activeGame?.clueTarget}</strong>.
            </h2>
            <br />
            <input
                type="text"
                placeholder="Enter clue..."
                value={clueInput}
                onChange={(e) => setClueInput(e.target.value)}
            />
            <br />
            <button onClick={handleClueSubmit}>Submit Clue</button>
        </section>
    )
}