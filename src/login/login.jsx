import React from "react";
import "../styles.css";

export default function Login() {
    return (
        <main>
            <form className="transparent-form" method="get" action="create_or_join.html">
                <h1>Login</h1>
                <div className="form-field">
                    <img src="./images/user.svg" />
                    <input type="text" id="usernameField" name="usernameValue" placeholder="Username" required />
                    <div style={{width: '25px'}}></div>
                </div>
                <div className="form-field">
                    <img src="./images/key.svg" />
                    <input type="password" id="passwordField" name="passwordValue" placeholder="Password" required />
                    <img src="./images/hide.svg" width="25" alt="Show" />
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