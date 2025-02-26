import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";

export default function WaitingRoom() {
    const navigate = useNavigate();
    const [loadingText, setLoadingText] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((text) => {
                if (text.length === 3) {
                    return '';
                }
                return text + '.';
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [loadingText]);

    return (
        <main>
            <form className="transparent-form">
                <h2>Game ID: 5296 | Hosted by John</h2>
                <p>Waiting for the host to start the game{loadingText}</p>
                <PlayerList />
            </form>
        </main>
    )
}