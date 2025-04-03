import React, { useEffect, useState } from "react";
import useSlider from "../customHooks/useSlider.jsx";
import { useGame } from "../customContext/gameContext.jsx";
import Leaderboard from "./leaderboard.jsx";
import PlayerVotes from "./playerVotes.jsx";
import useTimer from "../customHooks/useTimer.jsx";
import "../styles.css";
import Results from "./results.jsx";
import SubmitClue from "./submitClue.jsx";

export default function Play() {
    const { value: sliderValue, handleChange } = useSlider(5);
    const { activeGame, activeUser, setGame } = useGame();
    const { time, startTimer, pauseTimer, resetTimer } = useTimer(15);
    const [clueInput, setClueInput] = useState("");
    const clueGiver = activeGame?.players[activeGame?.currentItIndex]?.username || { name: "Loading...", username: "Loading..." };
    const activeUserIsClueGiver = activeUser?.username == clueGiver.username;

    // Replace me when you implement websocket!! :) -     
    async function getGameUpdates() {
        if (!activeGame) return;
        try {
            const res = await fetch(`/api/game?gameID=${activeGame.gameID}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const updatedGame = await res.json();
            if (res.ok) {
                setGame(updatedGame);
            } else {
                console.error(updatedGame.msg);
            }
        } catch (error) {
            console.error("Failed to update game", error);
        }
    }

    async function updateGame(game) {
        const res = await fetch(`/api/game?gameID=${game.gameID}`, {
            method: 'PUT',
            body: JSON.stringify({ game: game }),
            headers: { 'Content-Type': 'application/json' },
        });
        const updatedGame = await res.json();
        if (res.ok) {
            setGame(updatedGame);
        } else {
            console.error(updatedGame.msg);
        }
    }
    
    // async function updateGame() {
    //     const res = await fetch(`/api/game?gameID=${activeGame.gameID}`, {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    //     const updatedGame = await res.json();
    //     if (res.ok) {
    //         setGame(updatedGame);
    //     } else {
    //         console.log(updatedGame.msg);
    //     }
    //     if (updatedGame?.state === 'waiting') {
    //         resetTimer();
    //     } else if (updatedGame?.state === 'voting') {
    //         startTimer();
    //     }
    // }

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
            const interval = setInterval(getGameUpdates(), 1000);
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
        const game = { ...activeGame };
        game.players.findIndex(player => player.username === activeUser.username).activeVote = sliderValue;
        updateGame(game);
    };

    const handleClueSubmit = (e) => {
        e.preventDefault();
        if (!clueInput.trim()) return;
        const game = { ...activeGame };
        game.clue = clueInput.trim();
        game.state = "voting";
        updateGame(game);
        setClueInput("");
    };

    const resultsProps = {
        clueGiver: activeGame?.players[activeGame?.currentItIndex],
        clue: activeGame?.clue,
        clueTarget: activeGame?.clueTarget,
        lowerScale: activeGame?.lowerScale,
        upperScale: activeGame?.upperScale,
        players: activeGame?.players,
    };

    return (
        <main className="play">
            {activeGame?.state === "results" && <div className="round-results">
                <Results resultsProps={resultsProps} />
                <Leaderboard game={activeGame} />
            </div>}
            {activeGame?.state === "waiting" || true  && <div className="play-area">
                {!activeUserIsClueGiver ?
                    <SubmitClue clueInput={clueInput} handleClueSubmit={handleClueSubmit} setClueInput={setClueInput} activeGame={activeGame} /> :
                    <section>
                        <h2 className="play-header">
                            On a scale of <strong>{activeGame?.lowerScale}</strong> to <strong>{activeGame?.upperScale}</strong>, where does <i>{clueGiver.name}</i> place <strong>{activeGame?.clue}</strong>?
                        </h2>
                        <p style={{ textAlign: 'center' }}>
                            Waiting for a clue from {clueGiver.name}
                        </p>
                    </section>
                }
            </div>}
            {activeGame?.state === "voting" || true && <section>
                <h2 className="play-header">
                    On a scale of <strong>{activeGame?.lowerScale}</strong> to <strong>{activeGame?.upperScale}</strong>, where does <i>{clueGiver.name}</i> place <strong>{activeGame?.clue}</strong>?
                </h2>
                <h4 className="countdown" style={{ marginBottom: '2rem' }}>Time Remaining: {time}s</h4>
                <PlayerVotes players={activeGame?.players.filter(player => player.username !== clueGiver.username) || []} />
                {activeUserIsClueGiver && <>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBlock: '1rem' }}>
                        <span style={{ marginRight: '10px' }}><strong>{activeGame?.lowerScale}</strong></span>
                        <input type="range" min="1" max="10" value={sliderValue} onChange={handleChange} style={{ flex: 1 }} />
                        <span style={{ marginLeft: '10px' }}><strong>{activeGame?.upperScale}</strong></span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <input type="hidden" value={sliderValue} />
                        <button className="submit-vote" onClick={handleVoteSubmit}>Submit Vote</button>
                    </div>
                </>}
            </section>}
        </main>
    );
}
