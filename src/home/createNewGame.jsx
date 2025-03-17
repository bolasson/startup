import React, { useState, useEffect } from "react";
import { useGame } from "../customContext/gameContext";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";

export default function CreateGame() {
    const navigate = useNavigate();
    const [gameID, setGameID] = useState('');
    const [error, setError] = useState(null);
    const { activeUser, activeGame, setGame } = useGame();

    async function createGame() {
        const game = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        const gameData = await game.json();
        if (!game.ok) {
            setError(gameData.msg);
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
            setError(updatedGame.msg);
        }
        console.log(updatedGame);
    }

    useEffect(() => {
        if (!activeGame) {
          createGame();
        }
    }, [activeGame]);      

    useEffect(() => {
        if (activeGame) {
            const interval = setInterval(() => {
                updateGame();
            }, 1500);
            return () => clearInterval(interval);
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

    const startGame = (e) => {
        e.preventDefault();
        if (activeGame?.players.length < 2) {
            setError('You need at least 2 players to start a game.');
            return;
        }
        navigate('/play');
    }

    return (
        <main>
            <form className="transparent-form">
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value={gameID} readOnly />
                {error && <p className="error">{error}</p>}
                <PlayerList players={activeGame?.players || []} />
                <button onClick={startGame} style={{ width: 'auto' }} >Start Game</button>
            </form>
        </main>
    )
}