import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";
import useGameLogic from "../customHooks/useGameLogic";

export default function JoinGame() {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState(null);
    const { joinGame, isProcessing } = useGameLogic();
    const { user } = useGame();

    const handleJoin = () => {
        const codeString = joinCode.toString();

        if (codeString.length !== 4) {
            setError("Please enter a valid 4-digit code.");
            return;
        }
        
        setError(null);
        
        joinGame(joinCode, user);
        
        navigate("/home/waiting-room");
    };

    return (
        <main>
            <section>
                <p>Enter the code from your host to join their game.</p>
                <div className="form-field">
                    <input className="user-input" type="number" placeholder="ie 5296" required value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
                </div>
                <br />
                <button className="submit-vote" onClick={handleJoin} style={{ width: 'auto' }} disabled={isProcessing}>Join Game</button>
            </section>
            {error && <p className="error">{error}</p>}
        </main>
    )
}