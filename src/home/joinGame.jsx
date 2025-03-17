import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";

export default function JoinGame() {
    const navigate = useNavigate();
    const [gameID, setGameID] = useState("");
    const [error, setError] = useState(null);
    const { setGame } = useGame();

    async function joinGame(targetGameID) {
        const res = await fetch('/api/game/join', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameID: targetGameID }),
        });
        const joinedGameData = await res.json();
        if (!res.ok) {
            setError(joinedGameData.msg);
        } else {
            setGame(joinedGameData);
            navigate("/home/waiting-room");
        }
    }

    const handleJoin = (e) => {
        e.preventDefault();
        const codeString = gameID.toString();
        if (codeString.length !== 4) {
            setError("Please enter a valid 4-digit code.");
            return;
        }
        setError(null);
        const code = parseInt(gameID, 10);
        joinGame(code);
    };

    return (
        <main>
            <section>
                <p>Enter the code from your host to join their game.</p>
                <div className="form-field">
                    <input
                        className="user-input"
                        type="number"
                        placeholder="ie 5296"
                        required
                        value={gameID}
                        onChange={(e) => setGameID(e.target.value)}
                    />
                </div>
                <br />
                <button
                    className="submit-vote"
                    onClick={handleJoin}
                    style={{ width: 'auto' }}
                >
                    Join Game
                </button>
            </section>
            {error && <p className="error">{error}</p>}
        </main>
    );
}
