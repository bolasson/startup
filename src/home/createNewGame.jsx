import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGameLogic from "../customHooks/useGameLogic";
import PlayerList from "./playerList";

export default function CreateGame() {
    const navigate = useNavigate();
    const { createGame, isProcessing } = useGameLogic();
    const [gameCode, setGameCode] = useState('');

    useEffect(() => {
        const code = createGame();
        setGameCode(code);
    }, [createGame]);

    return (
        <main>
            <form className="transparent-form">
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value={gameCode} readOnly />
                <PlayerList />
                <button onClick={() => { navigate('/play') }} style={{ width: 'auto' }} disabled={isProcessing}>Start Game</button>
            </form>
        </main>
    )
}