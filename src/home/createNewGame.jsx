import React, { useState, useEffect } from "react";
import { useGame } from "../customContext/gameContext";
import { useNavigate } from "react-router-dom";
import { GameEvent, GameNotifier } from "../components/gameNotifier.js";
import PlayerList from "./playerList";

export default function CreateGame() {
    const navigate = useNavigate();
    const [gameID, setGameID] = useState('');
    const [error, setError] = useState(null);
    const { activeUser, activeGame, setGame } = useGame();

    useEffect(() => {
        if (!activeUser) {
            navigate("/", { replace: true });
        }
    }, [activeUser]);

    useEffect(() => {
        if (activeGame) {
            setGame(null);
        }
    }, []);

    if (!activeUser) {
        return (
            <main>
                <section className="intro">
                    <h2>You must be logged in to access this page.</h2>
                </section>
            </main>
        );
    }

    async function createGame() {
        const game = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const gameData = await game.json();
        if (!game.ok) {
            setError(gameData.msg);
            if (gameData.msg === "Unauthorized") {
                navigate("/logout", { replace: true });
            }
            return;
        }
        const res = await fetch('/api/game/join', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: gameData.gameID }),
        });
        const joinedGameData = await res.json();
        if (!res.ok) {
            setError(joinedGameData.msg);
        }
        setGame(joinedGameData);
        setGameID(joinedGameData.gameID);
    }

    async function startGame() {
        const res = await fetch(`/api/game/start`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: activeGame.gameID }),
        });
        const updatedGame = await res.json();
        if (!res.ok) {
            setError(updatedGame.msg);
        }
        setGame(updatedGame);
        navigate('/play');
    }

    useEffect(() => {
        if (!activeGame) {
            createGame();
        }
    }, [activeGame]);

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

    if (!activeGame) {
        return (
            <main>
                <section className="intro">
                    <h2>Loading...</h2>
                </section>
            </main>
        );
    }

    const handleStartGame = (e) => {
        e.preventDefault();
        if (activeGame?.players.length < 2) {
            setError('You need at least 2 players to start a game.');
            return;
        }
        startGame();
    }

    return (
        <main>
            <form className="transparent-form">
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value={gameID} readOnly />
                {error && <p className="error">{error}</p>}
                <PlayerList players={activeGame?.players || []} />
                <button onClick={handleStartGame} style={{ width: 'auto' }} >Start Game</button>
            </form>
        </main>
    )
}