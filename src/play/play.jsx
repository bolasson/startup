import React from "react";
import useSlider from "../custom_hooks/use_slider.jsx";
import "../styles.css";

export default function Play() {

    const { value: sliderValue, handleChange } = useSlider(5);

    return (
        <main className="play">
            <aside className="leaderboard">
                {/* <!-- Only the top five scores will be shown -->*/}
                <h2>Leaderboard</h2>
                {/* <!-- DATABASE: At the end, the scores will be sent to the database, associated with the given username. -->*/}
                <table className="rounded-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <li style={{ background: '#a545ff' }}>Jessica</li>
                            </td>
                            <td>18</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{ background: '#0FFF00' }}>Kyle</li>
                            </td>
                            <td>15</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{ background: '#FF00EC' }}>Emily</li>
                            </td>
                            <td>14</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{ background: '#FFFF00' }}>Wayne</li>
                            </td>
                            <td>11</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{ background: '#00D2FF' }}>Bryce</li>
                            </td>
                            <td>9</td>
                        </tr>
                    </tbody>
                </table>
            </aside>
            <div className="play-area">
                {/* <!-- Clue Component -->*/}
                {/* <!-- The number will be randomly generated on a scale of 1-10 each round. -->*/}
                {/* <!-- DATABASE: The opposite sides of the scale, in this case, ancient to modern, will be pulled from the database each round.-->*/}
                {/* <!-- <form className="transparent-form" method="get">
                    <p>Enter a clue to help players guess the number <strong>4</strong> on a scale of <strong>Ancient</strong> to <strong>Modern</strong>:</p>
                    <input className="user-input" type="text" id="clue" name="clue" placeholder="ie. rotary phones" required />
                    WEBSOCKET: The name, in this case, Kyle will be updated each round
                    API: The submit button below will make an API call to the profanity filter using the given clue, and return the result.
                    <button type="submit">Submit Clue</button>
                </form> -->*/}
                <section className="play-section">
                    <h2 style={{ textAlign: 'center', lineHeight: '2rem' }}>
                        On a scale of <strong>Ancient</strong> to <strong>Modern</strong>, where does <i>Kyle</i> place <strong>rotary phones</strong>?
                    </h2>
                    <h4 className="countdown">Time Remaining: 8s</h4>
                    {/* <!-- Voting Component -->*/}
                    {/* <!-- WEBSOCKET: The player votes below will update using websocket as people change their votes. -->*/}
                    {/* <!-- The table is so that the votes line up with the values on the slider below. Each row makes it so multiple people can be shown on the same voting value. -->*/}
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
                                <br />
                                <tr>
                                    {[...Array(10)].map((_, i) => (
                                        <td key={i}>{i + 1}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h2>Slider Value: {sliderValue}</h2>
                    {/* <!-- WEBSOCKET: Once the player votes, their vote will be broadcast using websocket. -->*/}
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
                    <form id="voteForm" method="get">
                        <input type="hidden" id="sliderValue" name="voteValue" value={sliderValue} />
                        <button className="submit-vote" type="submit">Submit Vote</button>
                    </form>
                </section>
            </div>
        </main>
    );
}