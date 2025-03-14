import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";
import "../styles.css";

export default function Stats() {
    const navigate = useNavigate();
    const { activeUser } = useGame();
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    if (!activeUser) {
        navigate('/');
    }

    useEffect(() => {
        fetch('/api/stats', {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch stats");
                }
                return response.json();
            })
            .then(data => setStats(data))
            .catch(err => setError(err.message));
    }, []);

    if (error) {
        return (
            <main>
                <section>
                    <p>Error: {error}</p>
                </section>
            </main>
        );
    }

    if (!stats) {
        return (
            <main>
                <section>
                    <p>Loading stats...</p>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section className="intro">
                <h2>Statistics for {activeUser?.name}</h2>
                <table className="rounded-table">
                    <tbody>
                        {Object.entries(stats).map(([stat, value], index) => (
                            <tr key={index}>
                                <td>{stat}</td>
                                <td>{value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}