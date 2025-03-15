import React, { useState, useEffect } from "react";
import { useGame } from "../customContext/gameContext";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";

export default function CreateGame() {
    const navigate = useNavigate();
    const [gameID, setGameID] = useState('');
    const [error, setError] = useState(null);
    const { activeUser, users, activeGame, createGame, joinGame, joinDummyGame, getGameUsers } = useGame();

    useEffect(() => {
        if (!activeUser) return;
        if (activeGame != null) return;
        createGame().then((response) => {
            if (response?.success) {
                setGameID(response.game.gameID);
            } else if (response?.error) {
                setError(response.error);
            }
        });
    }, [activeUser, activeGame]);

    useEffect(() => {
        if (!activeGame) return;
        const interval = setInterval(() => {
            joinDummyGame(activeGame.gameID).then((response) => {
                if (response?.error) {
                    console.error("Error adding dummy user:", response.error);
                }
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [activeGame, joinDummyGame]);

    const startGame = (e) => {
        e.preventDefault();
        navigate('/play');
    }

    return (
        <main>
            <form className="transparent-form">
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value={gameID} readOnly />
                {error && <p className="error">{error}</p>}
                <PlayerList players={activeGame?.players || []} />
                <button onClick={startGame} style={{ width: 'auto' }} disabled={activeGame?.players.length < 2}>Start Game</button>
            </form>
        </main>
    )
}