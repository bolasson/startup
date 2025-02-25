import React from 'react';
import { useGame } from '../customContext/gameContext.jsx';
import '../styles.css';

export default function Dev() {

    const { user } = useGame();

    return (
        <div>
            {user ? (
                <div className="user-details">
                    <p><strong>Username:</strong> {user.username}</p>
                </div>
            ) : (
                <p>No user logged in.</p>
            )}
        </div>
    );
}
