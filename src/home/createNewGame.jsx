import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGameLogic from "../customHooks/useGameLogic";
import { useGame } from "../customContext/gameContext";
import PlayerList from "./playerList";

// Used to simulate players joining the game until websocket connections are implemented.
const predefinedUsers = [
    { username: 'Alice' },
    { username: 'Bob' },
    { username: 'Charlie' },
    { username: 'David' },
    { username: 'Eve' },
    { username: 'Frank' },
    { username: 'Grace' },
];

export default function CreateGame() {
    const navigate = useNavigate();
    const { createGame, joinGame, getConnectedUsers, isProcessing } = useGameLogic();
    const [gameCode, setGameCode] = useState('');
    const { setGame } = useGame();
    const [joinPlayerAtIndex, setJoinPlayerAtIndex] = useState(0);
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const code = createGame();
        setGameCode(code);
    }, [createGame]);


    useEffect(() => {
        if (!gameCode) return;
        const joinInterval = setInterval(() => {
            if (joinPlayerAtIndex < predefinedUsers.length) {
                joinGame(gameCode, predefinedUsers[joinPlayerAtIndex]);
                getConnectedUsers(gameCode).then((playersList) => {
                    setPlayers(playersList);
                });
                setJoinPlayerAtIndex((prev) => prev + 1);
            } else {
                getConnectedUsers(gameCode).then((playersList) => {
                    setPlayers(playersList);
                });
                setJoinPlayerAtIndex((prev) => prev + 1);
                clearInterval(joinInterval);
            }
        }, 1000);
        return () => clearInterval(joinInterval);
    }, [gameCode, joinGame, getConnectedUsers]);

    const startGame = () => {
        if (setGame) {
            setGame({ gameCode, players });
            navigate('/play');
        }
    }

    return (
        <main>
            <form className="transparent-form">
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value={gameCode} readOnly />
                <PlayerList players={players} />
                <button onClick={startGame} style={{ width: 'auto' }} disabled={isProcessing || players.length < 2}>Start Game</button>
            </form>
        </main>
    )
}