import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";
import useGameLogic from "../customHooks/useGameLogic";
import CreateGame from "./createNewGame";

export default function JoinGame() {
    const navigate = useNavigate();
    const [joinCode, setJoinCode] = useState("");
    const [error, setError] = useState(null);
    const { createGame, gameExists, joinGame, isProcessing } = useGameLogic();
    const { user } = useGame();

    const waitForJoinToFinish = () => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (!isProcessing) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    };

    const handleJoin = () => {
        const codeString = joinCode.toString();
        const targetUser = user || { username: "Guest" };

        if (codeString.length !== 4) {
            setError("Please enter a valid 4-digit code.");
            return;
        }

        setError(null);

        if (gameExists(joinCode)) {
            joinGame(joinCode, targetUser);
            waitForJoinToFinish()
                .then(() => navigate("/home/waiting-room"));
        } else {
            createGame(joinCode);
            waitForJoinToFinish()
                .then(() => {
                    joinGame(joinCode, targetUser, 2);
                    return waitForJoinToFinish();
                })
                .then(() => {
                    navigate("/home/waiting-room")
                    return waitForJoinToFinish();
                });
        }
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