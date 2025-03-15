import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";
import { useGame } from "../customContext/gameContext.jsx";

export default function WaitingRoom() {
    const navigate = useNavigate();
    const { getUser, activeGame, joinDummyGame } = useGame();
    const [loadingText, setLoadingText] = useState('');
    const [startingGame, setStartingGame] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prev) => (prev.length === 3 ? "" : prev + "."));
        }, 1000);
        return () => clearInterval(interval);
    }, [loadingText]);

    useEffect(() => {
        if (!activeGame) return;
        const interval = setInterval(() => {
            joinDummyGame(activeGame.gameID).then((response) => {
                if (response?.error) {
                    console.error("Error adding dummy user:", response.error);
                }
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [activeGame, joinDummyGame]);

    useEffect(() => {
        if (activeGame?.players.length === 8 && !startingGame) {
            setStartingGame(true);
            setTimeout(() => {
                navigate("/play");
            }, 4000);
        }
    }, [activeGame?.players, startingGame, navigate]);

    return (
        <main>
            <form className="transparent-form">
                <h2>Game ID: {activeGame?.gameID || "(Loading...)"} | Hosted by {activeGame ? getUser(activeGame?.players[0].userID).name : '(Loading...)'}</h2>
                {!startingGame && <p>Waiting for the host to start the game{loadingText}</p>}
                {startingGame && <p>Starting game{loadingText}</p>}
                <PlayerList players={activeGame?.players || []} />
            </form>
        </main>
    )
}