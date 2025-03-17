import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";
import "../styles.css";

export default function Stats() {
    const navigate = useNavigate();
    const { activeUser, setUser } = useGame();

    useEffect(() => {
        (async () => {
            const res = await fetch('api/user/me');
            const data = await res.json();
            if (!res.ok) {
                setUser(null);
                navigate('/');
            } else {
                setUser(data);
            }
        })();
    }, []);

    if (!activeUser) {
        return (
            <main>
                <section className="intro">
                    <h2>Loading...</h2>
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
                        {Object.entries(activeUser?.stats).map(([stat, value], index) => (
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