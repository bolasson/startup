import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";
import { useGame } from "../customContext/gameContext.jsx";
import useGameLogic from "../customHooks/useGameLogic";

// Used to simulate players joining the game until websocket connections are implemented.
const predefinedUsers = [
    { username: 'Eve' },
    { username: 'Alice' },
    { username: 'Charlie' },
    { username: 'Frank' },
    { username: 'David' },
    { username: 'Grace' },
];

export default function WaitingRoom() {
    const navigate = useNavigate();
    const { game } = useGame();
    const { joinGame, getConnectedUsers } = useGameLogic();
    const [loadingText, setLoadingText] = useState('');
    const [startingGame, setStartingGame] = useState(false);
    const [players, setPlayers] = useState([]);
    const [joinPlayerAtIndex, setJoinPlayerAtIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prev) => (prev.length === 3 ? "" : prev + "."));
        }, 1000);
        return () => clearInterval(interval);
    }, [loadingText]);

    useEffect(() => {
        if (!game?.code) return;
        const joinInterval = setInterval(() => {
            if (joinPlayerAtIndex < predefinedUsers.length) {
                joinGame(game?.code, predefinedUsers[joinPlayerAtIndex]);
                getConnectedUsers(game?.code).then((playersList) => {
                    setPlayers(playersList);
                });
                setJoinPlayerAtIndex((prev) => prev + 1);
            } else {
                getConnectedUsers(game?.code).then((playersList) => {
                    setPlayers(playersList);
                });
                setJoinPlayerAtIndex((prev) => prev + 1);
                clearInterval(joinInterval);
            }
        }, 1000);
        return () => clearInterval(joinInterval);
    }, [game, joinGame, getConnectedUsers]);

    let host = players.length > 0 ? players[0].username : "(Loading...)";
    if (host != "(Loading...)") {
        host = host.replace(" (Host)", "");
    }

    // Temporary logic to replicate the host starting the game.
    if (players.length === 8 && !startingGame) {
        setStartingGame(true);
        setTimeout(() => {
            navigate(`/play`);
        }, 3000);
    }

    return (
        <main>
            <form className="transparent-form">
                <h2>Game ID: {game?.code || "(Loading...)"} | Hosted by {host}</h2>
                <p>Waiting for the host to start the game{loadingText}</p>
                {startingGame && <p>Starting game{loadingText}</p>}
                <PlayerList players={players}/>
            </form>
        </main>
    )
}