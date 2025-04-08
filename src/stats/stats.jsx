import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";
import "../styles.css";

export default function Stats() {
    const navigate = useNavigate();
    const { activeUser } = useGame();
    const [highscores, setHighscores] = useState(null);

    useEffect(() => {
        if (!activeUser) {
            navigate("/", { replace: true });
        }
        (async () => {
            const res = await fetch('api/scores');
            const data = await res.json();
            if (!res.ok) {
                console.log(data.msg);
            } else {
                setHighscores(data);
            }
        })();
    }, []);
    

    if (!activeUser) {
        return (
            <main>
                <section className="intro">
                    <h2>You must be logged in to access this page.</h2>
                </section>
            </main>
        );
    }

    return (
        <main style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
            <section className="intro">
                <h2>Statistics for {activeUser?.name}</h2>
                <table className="rounded-table">
                    <tbody>
                        {Object.entries(activeUser?.stats).map(([stat, value], index) => (
                            <tr key={index}>
                                <td>{stat}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section className="intro">
                <h2>Global Highscores</h2>
                <table className="rounded-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {highscores && Object.entries(highscores).map((user, index) => (
                            <tr key={index}>
                                <td>{user[1].name}</td>
                                <td>{user[1].stats["Total Points Scored"]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}