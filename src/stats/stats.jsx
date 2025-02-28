import React, { useState, useEffect } from "react";
import { useGame } from "../customContext/gameContext";
import "../styles.css";

const statsDatasets = [
    {
        "Games Played": 50,
        "Games Won": 20,
        "Total Points Scored": 1200,
        "Date Joined": "01-23-2025"
    },
    {
        "Games Played": 75,
        "Games Won": 30,
        "Total Points Scored": 1800,
        "Date Joined": "12-15-2024",
        "Last Played": "02-10-2025"
    },
    {
        "Games Won": 45,
        "Date Joined": "11-05-2024",
        "Last Played": "02-15-2025"
    }
];

export default function Stats() {
    const { activeUser } = useGame();
    const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0);

    // Cycle through datasets every 4 seconds to show that stats are updated from the database.
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDatasetIndex((prevIndex) => (prevIndex + 1) % statsDatasets.length);
        }, 4000);
        return () => clearInterval(intervalId);
    }, [statsDatasets.length]);

    const currentStats = statsDatasets[currentDatasetIndex];

    return (
        <main>
            <section className="intro">
                <h2>Statistics for {activeUser?.name || "User"}</h2>
                <table className="rounded-table">
                    <tbody>
                        {Object.entries(currentStats).map(([stat, value], index) => (
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