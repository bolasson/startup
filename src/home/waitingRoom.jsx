import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayerList from "./playerList";
import { useGame } from "../customContext/gameContext.jsx";

export default function WaitingRoom() {
    const navigate = useNavigate();
    const { activeUser, activeGame, setGame } = useGame();
    const [loadingText, setLoadingText] = useState('');
    const [joke, setJoke] = useState('Loading dad joke...');

    useEffect(() => {
        if (!activeUser) {
            navigate("/", { replace: true });
        }
    }, [activeUser]);

    if (!activeUser) {
        return (
            <main>
                <section className="intro">
                    <h2>You must be logged in to access this page.</h2>
                </section>
            </main>
        );
    }

    useEffect(() => {
        fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'MyReactApp (https://github.com/yourusername/yourrepo)'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setJoke(data.joke);
            })
            .catch((error) => {
                console.error('Error fetching dad joke:', error);
                setJoke('Two solidiers are in a tank. One turns to the other and says, "glub glub glub"');
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText((prev) => (prev.length === 3 ? "" : prev + "."));
        }, 1000);
        return () => clearInterval(interval);
    }, [loadingText]);

    async function updateGame() {
        const res = await fetch(`/api/game?gameID=${activeGame?.gameID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const updatedGame = await res.json();
        if (res.ok) {
            setGame(updatedGame);
        } else {
            console.log(updatedGame.msg);
        }
    }

    useEffect(() => {
        if (activeGame) {
            const interval = setInterval(() => {
                updateGame();
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [activeGame]);

    if (!activeGame) {
        return (
            <main>
                <form className="transparent-form">
                    <h2>The game you joined no longer exists</h2>
                    <button onClick={() => navigate('/home')} style={{ width: 'auto' }}>Home</button>
                </form>
            </main>
        );
    } else if (activeGame?.isStarted) {
        navigate('/play');
    }

    return (
        <main>
            <form className="transparent-form">
                <h2>Game ID: {activeGame?.gameID || "Loading..."} | Hosted by {activeGame ? activeGame?.players[0].name : 'Loading...'}</h2>
                {!activeGame?.isStarted && <p>Waiting for the host to start the game{loadingText}</p>}
                {activeGame?.isStarted && <p>Starting game{loadingText}</p>}
                <PlayerList players={activeGame?.players || []} />
                <p style={{ fontStyle: "italic", marginBlock: "1rem" }}>{joke}</p>
            </form>
        </main>
    )
}