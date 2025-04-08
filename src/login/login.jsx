import React, { useState, useEffect } from "react";
import { useGame } from "../customContext/gameContext.jsx";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function Login() {
    const navigate = useNavigate();
    const { activeUser, setUser } = useGame();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showCreateAccount, setShowCreateAccount] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeUser || localStorage.getItem('user')) {
            navigate('home');
        }
    }, []);

    function handleLogin() {
        authenticateUser('PUT');
    }

    function handleAccountCreation() {
        authenticateUser('POST');
    }

    async function authenticateUser(method) {
        const res = await fetch('api/user', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.toLowerCase(), password: password, name: name }),
        });
        const data = await res.json();
        if (res.ok) {
            setUser(data);
            navigate('home');
        } else {
            setError(data.msg);
        }
    }

    return (
        <main>
            <form onSubmit={e => e.preventDefault()} className="transparent-form">
                <h1>{showCreateAccount ? 'Create Account' : 'Login'}</h1>
                <div className="form-field">
                    <img src="/user.svg" width={40} height={40} alt="User Icon" />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="username" />
                    <div style={{ width: '25px' }}></div>
                </div>
                <div className="form-field">
                    <img src="/key.svg" width={40} height={40} alt="Key Icon" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" autoComplete="current-password" />
                    <img
                        src={showPassword ? "/show.svg" : "/hide.svg"}
                        width={25}
                        height={25}
                        alt={showPassword ? "Show Icon" : "Hide Icon"}
                        onClick={() => setShowPassword(prev => !prev)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
                {showCreateAccount &&
                    <div className="form-field">
                        <img src="/name.svg" width={40} height={40} />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" autoComplete="name" />
                        <div style={{ width: '25px' }}></div>
                    </div>
                }
                <br />
                <p className="text-button" onClick={() => setShowCreateAccount(!showCreateAccount)}>{showCreateAccount ? 'Back to login' : 'Create a new account'}</p>
                <br />
                <div className="button-container">
                    {showCreateAccount ?
                        <button type="submit" onClick={handleAccountCreation}>Create Account</button> :
                        <button type="submit" onClick={handleLogin}>Login</button>}
                </div>
            </form>
            {error && <p className="error">{error}</p>}
        </main>
    );
}