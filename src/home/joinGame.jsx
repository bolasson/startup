import React from "react";
import { useNavigate } from "react-router-dom";

export default function JoinGame() {
    const navigate = useNavigate();

    return (
        <main>
            <section>
                <p>Enter the code from your host to join their game.</p>
                <div className="form-field">
                    <input className="user-input" type="number" id="joinCodeField" name="joinCodeValue" placeholder="ie 5296" required />
                </div>
                <br />
                <button className="submit-vote" onClick={() => { navigate('/play') }} style={{ width: 'auto' }}>Join Game</button>
            </section>
        </main>
    )
}