import React, { useState } from "react";
import { useGame } from "../customContext/gameContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const { login } = useGame();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username);
        navigate('/home');
    };

    return (
        <main>
            <form className="transparent-form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="form-field">
                    <img src="/user.svg" />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
                    <div style={{ width: '25px' }}></div>
                </div>
                <div className="form-field">
                    <img src="/key.svg" />
                    <input type="password" id="passwordField" name="passwordValue" placeholder="Password" required />
                    <img src="/hide.svg" width="25" alt="Show" />
                </div>
                <br />
                <div className="button-container">
                    <button type="submit">Login</button>
                    <button type="submit">Create Player</button>
                </div>
            </form>
        </main>
    );
}