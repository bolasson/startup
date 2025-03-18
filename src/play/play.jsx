import React, { useEffect, useState } from "react";
import useSlider from "../customHooks/useSlider.jsx";
import { useGame } from "../customContext/gameContext.jsx";
import Leaderboard from "./leaderboard.jsx";
import PlayerVotes from "./playerVotes.jsx";
import useTimer from "../customHooks/useTimer.jsx";
import "../styles.css";

export default function Play() {
    const { value: sliderValue, handleChange } = useSlider(5);
    const { activeGame, activeUser, setGame } = useGame();
    const { time, startTimer, pauseTimer, resetTimer } = useTimer(15);
    const [clueInput, setClueInput] = useState("");

    const isIt = activeGame && activeUser && activeGame.players[activeGame.currentItIndex].username === activeUser.username;

    const itPlayer = activeGame && activeGame.players[activeGame.currentItIndex] ?
        activeGame.players[activeGame.currentItIndex] :
        null;
    
    const itPlayerName = itPlayer?.name || "Loading...";

    // Replace me when you implement websocket!! :) - Bryce
    async function updateGame() {
        const res = await fetch(`/api/game?gameID=${activeGame.gameID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const updatedGame = await res.json();
        if (res.ok) {
            setGame(updatedGame);
        } else {
            console.log(updatedGame.msg);
        }
        if (updatedGame.state === 'waiting') {
            resetTimer();
        } else if (updatedGame.state === 'voting') {
            startTimer();
        }
    }

    async function submitVote() {
        const voteValue = parseInt(sliderValue, 10);
        const game = await fetch('/api/play/vote', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: activeGame.gameID, vote: voteValue }),
        });
        const gameData = await game.json();
        if (!game.ok) {
            console.log(gameData.msg);
        }
    }

    async function submitClue() {
        const game = await fetch('/api/play/clue', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: activeGame.gameID, clue: clueInput.trim() }),
        });
        const gameData = await game.json();
        if (!game.ok) {
            console.log(gameData.msg);
        }
    }

    async function endRound() {
        const game = await fetch('/api/game/end-round', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: activeGame.gameID }),
        });
        const gameData = await game.json();
        if (!game.ok) {
            console.log(gameData.msg);
        }
    }

    useEffect(() => {
        if (activeGame) {
            const interval = setInterval(() => {
                updateGame();
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeGame]);

    useEffect(() => {
        if (activeGame && activeGame.clue) {
            startTimer();
        } else {
            pauseTimer();
        }
    }, [activeGame, startTimer, pauseTimer]);

    useEffect(() => {
        if (time === 0 && activeGame && activeUser?.username === activeGame.players.find(player => player.isHost)?.username) {
            endRound();
        }
    }, [time, activeGame, resetTimer, startTimer]);

    const handleVoteSubmit = (e) => {
        e.preventDefault();
        if (!activeGame || !activeUser) return;
        submitVote();
    };

    const handleClueSubmit = (e) => {
        e.preventDefault();
        if (!activeGame || !activeUser || !clueInput.trim()) return;
        submitClue();
        setClueInput("");
    };

    return (
        <main className="play">
            <Leaderboard game={activeGame}/>
            <div className="play-area">
                <section className="play-section">
                    {activeGame && activeGame.clue && (
                        <h2 style={{ textAlign: 'center', lineHeight: '2rem' }}>
                            On a scale of <strong>{activeGame.lowerScale}</strong> to <strong>{activeGame.upperScale}</strong>, where does <i>{itPlayerName}</i> place <strong>{activeGame.clue}</strong>?
                        </h2>)}
                    {activeGame && !activeGame.clue && (
                        <>
                            {isIt ? (
                                <form className="transparent-form" onSubmit={handleClueSubmit} style={{ textAlign: 'center' }}>
                                    <h2 style={{ textAlign: 'center', lineHeight: '2rem' }}>
                                        For a scale of <strong>{activeGame.lowerScale}</strong> to <strong>{activeGame.upperScale}</strong>, submit a clue to help players guess the number <strong>{activeGame.clueTarget}</strong>.
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
                                    Waiting for clue from {activeGame.players[activeGame.currentItIndex].name}
                                </p>
                            )}
                        </>
                    )}
                    {activeGame && activeGame.clue && (
                        <>
                            <h4 className="countdown" style={{ marginBottom: '2rem' }}>Time Remaining: {time}s</h4>
                            <PlayerVotes players={activeGame?.players.filter(player => player.username !== activeGame.players[activeGame.currentItIndex].username) || []} />
                            {!isIt && <><h2>Slider Value: {sliderValue}</h2>
                                <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '2rem' }}>
                                    <span style={{ marginRight: '10px' }}><strong>{activeGame.lowerScale}</strong></span>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={sliderValue}
                                        onChange={handleChange}
                                        style={{ flex: 1 }}
                                    />
                                    <span style={{ marginLeft: '10px' }}><strong>{activeGame.upperScale}</strong></span>
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
