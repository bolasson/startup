import React, { useState, useEffect } from "react";
import { useGame } from "../customContext/gameContext";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";

export default function CreateGame() {
    const navigate = useNavigate();
    const [gameID, setGameID] = useState('');
    const [error, setError] = useState(null);
    const { activeUser, users, activeGame, createGame, joinGame, getGameUsers } = useGame();

    useEffect(() => {
        if (!activeUser) return;
        createGame(activeUser).then((response) => {
            if (response?.success) {
                setGameID(response.gameID);
                console.log('Game created successfully:', response.gameID);
            } else if (response?.error) {
                console.error('500: An unexpected error occurred while creating a new game.', response.error);
                setError(response.error);
            }
        });
    }, []);

    useEffect(() => {
        if (!activeGame) return;

        const interval = setInterval(() => {
            const remainingUsers = users.filter(
                (u) => !activeGame.players.some((p) => p.userID === u.userID)
            );
            if (remainingUsers.length > 0 && activeGame.players.length < 8) {
                const userToAdd = remainingUsers[0];
                joinGame(activeGame.gameID, userToAdd).then((response) => {
                    if (response?.success) {
                    } else if (response?.error) {
                        console.error("Error adding user to game:", response.error);
                    }
                });
            } else {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [activeGame, users, joinGame, getGameUsers]);


    const startGame = () => {
        navigate('/play');
    }

    return (
        <main>
            <form className="transparent-form">
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value={gameID} readOnly />
                {error && <p className="error">{error}</p>}
                <PlayerList players={activeGame?.players || []} />
                <button onClick={startGame} style={{ width: 'auto' }} disabled={activeGame?.players.length < 2}>Start Game</button>
            </form>
        </main>
    )
}