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

    if (!activeGame) {
        createGame();
        return (
            <main>
                <section className="intro">
                    <h2>Loading...</h2>
                </section>
            </main>
        );
    } else {
            // const interval = setInterval(async () => {
            //     const res = await fetch('api/game', {
            //         method: 'GET',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ gameID: activeGame.gameID }),
            //     });
            //     const updatedGame = await res.json();
            //     if (res.ok) {
            //         setGame(updatedGame);
            //     } else {
            //         setError(updatedGame.msg);
            //     }
            // }, 1500);
            // return () => clearInterval(interval);
        console.log(activeGame ? activeGame : 'no active game');
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
                {/* <PlayerList players={activeGame?.players || []} /> */}
                <button onClick={startGame} style={{ width: 'auto' }} >Start Game</button>
            </form>
        </main>
    )
}