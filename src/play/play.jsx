import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSlider from "../customHooks/useSlider.jsx";
import { useGame } from "../customContext/gameContext.jsx";
import Leaderboard from "./leaderboard.jsx";
import PlayerVotes from "./playerVotes.jsx";
import useTimer from "../customHooks/useTimer.jsx";
import Results from "./results.jsx";
import SubmitClue from "./submitClue.jsx";
import { GameEvent, GameNotifier } from "../components/gameNotifier.js";
import "../styles.css";

export default function Play() {
    const navigate = useNavigate();
    const { value: sliderValue, handleChange } = useSlider(5);
    const { activeGame, activeUser, setGame, setUser } = useGame();
    const { time: votingTime, startTimer: startVotingTimer, pauseTimer: pauseVotingTimer, resetTimer: resetVotingTimer } = useTimer(20);
    const { time: resultsTime, startTimer: startResultsTimer, pauseTimer: pauseResultsTimer, resetTimer: resetResultsTimer } = useTimer(11);
    const [clueInput, setClueInput] = useState("");
    const clueGiver = activeGame?.players[activeGame?.currentItIndex] || { name: "Loading...", username: "Loading..." };
    const hostUser = activeGame?.players.find(player => player.isHost) || { name: "Loading...", username: "Loading..." };
    const isHostUser = activeUser?.username == hostUser.username;
    const isClueGiver = activeUser?.username == clueGiver.username;

    useEffect(() => {
        if (!activeUser) {
            navigate("/", { replace: true });
        } else if (!activeGame) {
            navigate("/home", { replace: true });
        }
    }, [activeUser, activeGame]);

    if (!activeUser) {
        return (
            <main>
                <section className="intro">
                    <h2>You must be logged in to access this page.</h2>
                </section>
            </main>
        );
    }

    if (!activeGame) {
        return (
            <main>
                <section className="intro">
                    <h2>You have not joined a game. Please join one from the home screen.</h2>
                </section>
            </main>
        );
    }

    async function viewResults() {
        const game = await fetch('/api/play/view-results', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: activeGame.gameID }),
        });
        const gameData = await game.json();
        if (game.ok) {
            setGame(gameData);
        } else {
            console.log(gameData.msg);
        }
    }

    async function endRound() {
        const game = await fetch('/api/play/end-round', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: activeGame.gameID }),
        });
        const gameData = await game.json();
        if (game.ok) {
            setGame(gameData);
        } else {
            console.log(gameData.msg);
        }
    }

    useEffect(() => {
        if (activeGame) {
            console.log("Subscribing to game updates for gameID:", activeGame.gameID);
            GameNotifier.sendMessage({ type: "subscribe", gameID: activeGame.gameID });
            const handleGameUpdate = (event) => {
                if (event.type === GameEvent.Update && event.game && event.game.gameID === activeGame.gameID) {
                    setGame(event.game);
                }
            };
            GameNotifier.addHandler(handleGameUpdate);
            return () => {
                GameNotifier.removeHandler(handleGameUpdate);
            };
        }
    }, [activeGame]);

    useEffect(() => {
        if (activeGame?.state === "voting") {
            resetResultsTimer();
            startVotingTimer();
        } else {
            pauseVotingTimer();
        }
        if (activeGame?.state === "results") {
            resetVotingTimer();
            startResultsTimer();
        } else {
            pauseResultsTimer();
        }
    }, [activeGame, startVotingTimer, startResultsTimer]);

    useEffect(() => {
        if (activeGame?.state === "voting" && votingTime === 0 && isHostUser) {
            viewResults();
            resetVotingTimer();
        }
    }, [votingTime, activeGame]);   

    useEffect(() => {
        if (activeGame?.state === "results" && resultsTime === 0 && isHostUser) {
            endRound();
            resetResultsTimer();
        }
    }, [resultsTime, activeGame]);

    const handleVoteSubmit = async (e) => {
        e.preventDefault();    
        try {
            const res = await fetch("/api/play/vote", {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameID: activeGame.gameID,
                    vote: sliderValue,
                }),
            });
            const updatedGame = await res.json();
            if (res.ok) {
                setGame(updatedGame);
            } else {
                console.error(updatedGame.msg);
            }
        } catch (err) {
            console.error("Vote submit failed:", err);
        }
    };
    
    const handleClueSubmit = async (e) => {
        e.preventDefault();
        if (!clueInput.trim()) return;
        try {
            const res = await fetch("/api/play/clue", {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gameID: activeGame.gameID,
                    clue: clueInput.trim(),
                }),
            });
            const updatedGame = await res.json();
            if (res.ok) {
                setGame(updatedGame);
                setClueInput("");
            } else {
                console.error(updatedGame.msg);
            }
        } catch (err) {
            console.error("Clue submit failed:", err);
        }
    };    

    const resultsProps = {
        clueGiver: activeGame?.players[activeGame?.currentItIndex],
        clue: activeGame?.clue,
        clueTarget: activeGame?.clueTarget,
        lowerScale: activeGame?.lowerScale,
        upperScale: activeGame?.upperScale,
        players: activeGame?.players,
        nextRoundTimer: resultsTime,
    };

    return (
        <main className="play">
            {activeGame?.state === "results" && <div className="round-results">
                <Results resultsProps={resultsProps} />
                <Leaderboard game={activeGame} />
            </div>}
            {activeGame?.state === "waiting" && <div className="play-area">
                {isClueGiver ?
                    <SubmitClue clueInput={clueInput} handleClueSubmit={handleClueSubmit} setClueInput={setClueInput} activeGame={activeGame} /> :
                    <section>
                        <p style={{ textAlign: 'center' }}>
                            Waiting for a clue from {clueGiver.name}
                        </p>
                    </section>
                }
            </div>}
            {activeGame?.state === "voting" && <section>
                <h2 className="play-header">
                    On a scale of <strong>{activeGame?.lowerScale}</strong> to <strong>{activeGame?.upperScale}</strong>, where does <i>{clueGiver.name}</i> place <strong>{activeGame?.clue}</strong>?
                </h2>
                <h4 className="countdown" style={{ marginBottom: '2rem' }}>Time Remaining: {votingTime}s</h4>
                <PlayerVotes players={activeGame?.players.filter(player => player.username !== clueGiver.username) || []} />
                {!isClueGiver && <>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center', marginBlock: '1rem' }}>
                        <span style={{ marginRight: '10px' }}><strong>{activeGame?.lowerScale}</strong></span>
                        <input type="range" min="1" max="10" value={sliderValue} onChange={handleChange} style={{ flex: 1 }} />
                        <span style={{ marginLeft: '10px' }}><strong>{activeGame?.upperScale}</strong></span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <input type="hidden" value={sliderValue} />
                        <button className="submit-vote" onClick={handleVoteSubmit}>{`Submit Vote (${sliderValue})`}</button>
                    </div>
                </>}
            </section>}
        </main>
    );
}
