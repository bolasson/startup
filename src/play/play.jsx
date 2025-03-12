import React, { useEffect, useState } from "react";
import useSlider from "../customHooks/useSlider.jsx";
import { useGame } from "../customContext/gameContext.jsx";
import Leaderboard from "./leaderboard.jsx";
import PlayerVotes from "./playerVotes.jsx";
import useTimer from "../customHooks/useTimer.jsx";
import "../styles.css";

const presetScales = [
    { low: "Ancient", high: "Modern" },
    { low: "Slow", high: "Fast" },
    { low: "Soft", high: "Loud" },
    { low: "Small", high: "Big" },
    { low: "Cold", high: "Hot" },
    { low: "Simple", high: "Complex" },
    { low: "Cheap", high: "Expensive" },
    { low: "Weak", high: "Strong" },
    { low: "Dull", high: "Bright" },
    { low: "Old", high: "New" }
];

const presetClues = [
    "a cat",
    "a dog",
    "a tree",
    "a car",
    "a house",
    "a computer",
    "a book",
    "a phone",
    "a person",
    "a building"
];

export default function Play() {
    const { value: sliderValue, handleChange } = useSlider(5);
    const { activeGame, activeUser, getUser, submitVote, scoreVotes, submitClue } = useGame();
    const { time, startTimer, pauseTimer, resetTimer } = useTimer(25);
    const [clueInput, setClueInput] = useState("");
    const [scaleLabels, setScaleLabels] = useState(presetScales[0]);

    const isIt = activeGame && activeUser && activeGame.players[activeGame.currentItIndex].userID === activeUser.userID;

    const itPlayer = activeGame && activeGame.players[activeGame.currentItIndex] ?
        getUser(activeGame.players[activeGame.currentItIndex].userID) :
        null;

    const itPlayerName = itPlayer?.name || "(Loading...)";

    // Automatically submit a clue for websocket placeholder players
    useEffect(() => {
        if (activeGame && !activeGame.clue && !isIt) {
            const timerId = setTimeout(() => {
                const presetClue = presetClues[Math.floor(Math.random() * presetClues.length)];
                const presetScale = presetScales[Math.floor(Math.random() * presetScales.length)];
                submitClue(activeGame.gameID, presetClue);
                setScaleLabels(presetScale);
            }, 3000);
            return () => clearTimeout(timerId);
        }
    }, [activeGame, isIt, submitClue]);


    useEffect(() => {
        if (activeGame && activeGame.clue) {
            startTimer();
        } else {
            pauseTimer();
        }
    }, [activeGame, startTimer, pauseTimer]);

    useEffect(() => {
        if (time === 0 && activeGame) {
            scoreVotes(activeGame.gameID);
            resetTimer();
            startTimer();
        }
    }, [time, activeGame, scoreVotes, resetTimer, startTimer]);

    const handleVoteSubmit = (e) => {
        e.preventDefault();
        if (!activeGame || !activeUser) return;
        const voteValue = parseInt(sliderValue, 10);
        submitVote(activeGame.gameID, activeUser.userID, voteValue);
    };

    const handleClueSubmit = (e) => {
        e.preventDefault();
        if (!activeGame || !activeUser || !clueInput.trim()) return;
        submitClue(activeGame.gameID, clueInput.trim());
        setClueInput("");
    };

    return (
        <main className="play">
            <Leaderboard />
            <div className="play-area">
                <section className="play-section">
                    {activeGame && activeGame.clue && (
                        <h2 style={{ textAlign: 'center', lineHeight: '2rem' }}>
                            On a scale of <strong>{scaleLabels.low}</strong> to <strong>{scaleLabels.high}</strong>, where does <i>{itPlayerName}</i> place <strong>{activeGame.clue}</strong>?
                        </h2>)}
                    {activeGame && !activeGame.clue && (
                        <>
                            {isIt ? (
                                <form className="transparent-form" onSubmit={handleClueSubmit} style={{ textAlign: 'center' }}>
                                    <h2 style={{ textAlign: 'center', lineHeight: '2rem' }}>
                                        For a scale of <strong>{scaleLabels.low}</strong> to <strong>{scaleLabels.high}</strong>, submit a clue to help players guess the number <strong>{activeGame.clueTarget}</strong>.
                                    </h2>
                                    <br />
                                    <input
                                        type="text"
                                        placeholder="Enter your clue..."
                                        value={clueInput}
                                        onChange={(e) => setClueInput(e.target.value)}
                                    />
                                    <br />
                                    <button type="submit">Submit Clue</button>
                                </form>
                            ) : (
                                <p style={{ textAlign: 'center' }}>
                                    Waiting for clue from {getUser(activeGame.players[activeGame.currentItIndex].userID).name}
                                </p>
                            )}
                        </>
                    )}
                    {activeGame && activeGame.clue && (
                        <>
                            <h4 className="countdown" style={{ marginBottom: '2rem' }}>Time Remaining: {time}s</h4>
                            <PlayerVotes players={activeGame?.players.filter(player => player.userID !== activeGame.players[activeGame.currentItIndex].userID) || []} />
                            {!isIt && <><h2>Slider Value: {sliderValue}</h2>
                            <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
                                <span style={{ marginRight: '10px' }}><strong>{scaleLabels.low}</strong></span>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={sliderValue}
                                    onChange={handleChange}
                                    style={{ flex: 1 }}
                                />
                                <span style={{ marginLeft: '10px' }}><strong>{scaleLabels.high}</strong></span>
                            </div>
                            <form id="voteForm" onSubmit={handleVoteSubmit}>
                                <input type="hidden" id="sliderValue" name="voteValue" value={sliderValue} />
                                <button className="submit-vote" type="submit">Submit Vote</button>
                            </form></>}
                        </>)}
                </section>
            </div>
        </main>
    );
}
