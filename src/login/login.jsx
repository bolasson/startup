import React, { useState } from "react";
import { useGame } from "../customContext/gameContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loginError } = useGame();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password).then((success) => {
            if (success) {
                navigate('/home');
            }
        });
    };

    return (
        <main>
            <form className="transparent-form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="form-field">
                    <img src="/user.svg" />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="name"/>
                    <div style={{ width: '25px' }}></div>
                </div>
                <div className="form-field">
                    <img src="/key.svg" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password"/>
                    <img
                        src={showPassword ? "/show.svg" : "/hide.svg"}
                        width="25"
                        alt={showPassword ? "Show" : "Hide"}
                        onClick={() => setShowPassword(prev => !prev)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                <br />
                <div className="button-container">
                    <button type="submit">Login</button>
                    <button type="submit">Create Player</button>
                </div>
            </form>
            {loginError && <p className="error">{loginError}</p>}
        </main>
    );
}