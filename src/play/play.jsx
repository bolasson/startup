import React from "react";
import useSlider from "../customHooks/useSlider.jsx";
import { useGame } from "../customContext/gameContext.jsx";
import Leaderboard from "./leaderboard.jsx";
import "../styles.css";

export default function Play() {
    const { value: sliderValue, handleChange } = useSlider(5);
    const { activeGame, activeUser, submitVote } = useGame();

    const handleVoteSubmit = (e) => {
        e.preventDefault();
        if (!activeGame || !activeUser) return;
        const voteValue = parseInt(sliderValue, 10);
        submitVote(activeGame.gameID, activeUser.userID, voteValue);
    };

    return (
        <main className="play">
            <Leaderboard />
            <div className="play-area">
                <section className="play-section">
                    <h2 style={{ textAlign: 'center', lineHeight: '2rem' }}>
                        On a scale of <strong>Ancient</strong> to <strong>Modern</strong>, where does <i>Kyle</i> place <strong>rotary phones</strong>?
                    </h2>
                    <h4 className="countdown">Time Remaining: 8s</h4>
                    {/* Simulated player votes area (static for now) */}
                    <div className="player-votes-container">
                        <table className="player-votes">
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><span style={{ background: '#665BFF' }}>T</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><span style={{ background: '#FF9200' }}>D</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><span style={{ background: '#A545FF' }}>J</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><span style={{ background: '#FF0010' }}>N</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><span style={{ background: '#00D2FF' }}>B</span></td>
                                    <td><span style={{ background: '#FF00EC' }}>E</span></td>
                                    <td></td>
                                    <td></td>
                                    <td><span style={{ background: '#FFFF00' }}>W</span></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    {[...Array(10)].map((_, i) => (
                                        <td key={i}>{i + 1}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h2>Slider Value: {sliderValue}</h2>
                    <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px' }}><strong>Ancient</strong></span>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={sliderValue}
                            onChange={handleChange}
                            style={{ flex: 1 }}
                        />
                        <span style={{ marginLeft: '10px' }}><strong>Modern</strong></span>
                    </div>
                    {/* Handle vote submission using our onSubmit handler */}
                    <form id="voteForm" onSubmit={handleVoteSubmit}>
                        <input type="hidden" id="sliderValue" name="voteValue" value={sliderValue} />
                        <button className="submit-vote" type="submit">Submit Vote</button>
                    </form>
                </section>
            </div>
        </main>
    );
}
