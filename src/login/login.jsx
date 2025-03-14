import React, { useState } from "react";
import { useGame } from "../customContext/gameContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {
    const navigate = useNavigate();
    const { loginUser, createUser } = useGame();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        loginUser(username.toLowerCase(), password).then((result) => {
            if (result.success) {
                navigate('/home');
            } else if (result.error) {
                setError(result.error);
            }
        });
    };

    const handleCreateAccount = (e) => {
        e.preventDefault();
        createUser(username.toLowerCase(), password, name).then((result) => {
            if (result.success) {
                navigate('/home');
            } else if (result.error) {
                setError(result.error);
            }
        });
    };

    return (
        <main>
            <form className="transparent-form">
                <h1>{showCreateAccount ? 'Create Account' : 'Login'}</h1>
                <div className="form-field">
                    <img src="/user.svg" />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="username" />
                    <div style={{ width: '25px' }}></div>
                </div>
                <div className="form-field">
                    <img src="/key.svg" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
                    <img
                        src={showPassword ? "/show.svg" : "/hide.svg"}
                        width="25"
                        alt={showPassword ? "Show" : "Hide"}
                        onClick={() => setShowPassword(prev => !prev)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                {showCreateAccount &&
                    <div className="form-field">
                        <img src="/name.svg" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" autoComplete="name" />
                        <div style={{ width: '25px' }}></div>
                    </div>
                }
                <br />
                <a onClick={() => setShowCreateAccount(!showCreateAccount)} style={{ cursor: "pointer", alignContent: 'center' }}>{showCreateAccount ? 'Back to login' : 'Create a new account'}</a>
                <br />
                <div className="button-container">
                    {showCreateAccount ?
                        <button type="submit" onClick={handleCreateAccount}>Create Account</button> :
                        <button type="submit" onClick={handleLogin}>Login</button>}
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </main>
    );
}