import React from "react";
import "../styles.css";

export default function Play() {
    return (
        <main class="play">
            <aside class="leaderboard">
                {/* <!-- Only the top five scores will be shown -->*/}
                <h2>Leaderboard</h2>
                {/* <!-- DATABASE: At the end, the scores will be sent to the database, associated with the given username. -->*/}
                <table class="rounded-table">
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <li style={{background: '#a545ff'}}>Jessica</li>
                            </td>
                            <td>18</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{background: '#0FFF00'}}>Kyle</li>
                            </td>
                            <td>15</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{background: '#FF00EC'}}>Emily</li>
                            </td>
                            <td>14</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{background: '#FFFF00'}}>Wayne</li>
                            </td>
                            <td>11</td>
                        </tr>
                        <tr>
                            <td>
                                <li style={{background: '#00D2FF'}}>Bryce</li>
                            </td>
                            <td>9</td>
                        </tr>
                    </tbody>
                </table>
            </aside>
            <div class="play-area">
                {/* <!-- Clue Component -->*/}
                {/* <!-- The number will be randomly generated on a scale of 1-10 each round. -->*/}
                {/* <!-- DATABASE: The opposite sides of the scale, in this case, ancient to modern, will be pulled from the database each round.-->*/}
                {/* <!-- <form class="transparent-form" method="get">
                    <p>Enter a clue to help players guess the number <strong>4</strong> on a scale of <strong>Ancient</strong> to <strong>Modern</strong>:</p>
                    <input class="user-input" type="text" id="clue" name="clue" placeholder="ie. rotary phones" required />
                    WEBSOCKET: The name, in this case, Kyle will be updated each round
                    API: The submit button below will make an API call to the profanity filter using the given clue, and return the result.
                    <button type="submit">Submit Clue</button>
                </form> -->*/}
                <section class="play-section">
                    <h2 style={{textAlign: 'center', lineHeight: '2rem'}}>
                        On a scale of <strong>Ancient</strong> to <strong>Modern</strong>, where does <i>Kyle</i> place <strong>rotary phones</strong>?
                    </h2>
                    <h4 class="countdown">Time Remaining: 8s</h4>
                    {/* <!-- Voting Component -->*/}
                    {/* <!-- WEBSOCKET: The player votes below will update using websocket as people change their votes. -->*/}
                    {/* <!-- The table is so that the votes line up with the values on the slider below. Each row makes it so multiple people can be shown on the same voting value. -->*/}
                    <div class="player-votes-container">
                        <table class="player-votes">
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
                                <td><span style={{background: '#665BFF'}}>T</span></td>
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
                                <td><span style={{background: '#FF9200'}}>D</span></td>
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
                                <td><span style={{background: '#A545FF'}}>J</span></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><span style={{background: '#FF0010'}}>N</span></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><span style={{background: '#00D2FF'}}>B</span></td>
                                <td><span style={{background: '#FF00EC'}}>E</span></td>
                                <td></td>
                                <td></td>
                                <td><span style={{background: '#FFFF00'}}>W</span></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                        {/* <!-- The Table-Based Slider (patent pending) -->*/}
                        {/* <!-- This eldritch abomination of a slider is because the regular input range slider didn't have the custimization I wanted, and capabillites for perfectly lining up other elements with the tickmarks. The obvious solution? Build an entirely new type of input component that will be a glorious combination of the table element, CSS, and JavaScript. I will document it well. -->*/}
                        <div class="slider-container">
                            {/* <!-- This table contains the labels to match up with the slider. It is optional-->*/}
                            <table class="slider-labels">
                                <tr>
                                    <td>1</td>
                                    <td>2</td>
                                    <td>3</td>
                                    <td>4</td>
                                    <td>5</td>
                                    <td>6</td>
                                    <td>7</td>
                                    <td>8</td>
                                    <td>9</td>
                                    <td>10</td>
                                </tr>
                            </table>
                            {/* <!-- This div is the input range slider replacement. Each td represents a possible value on the slider, and the div is the knob used to control it. -->*/}
                            <div id="sliderContainer">
                                <table class="slider">
                                    <tr>
                                        <td data-value="1"></td>
                                        <td data-value="2"></td>
                                        <td data-value="3"></td>
                                        <td data-value="4"></td>
                                        <td data-value="5"></td>
                                        <td data-value="6"></td>
                                        <td data-value="7"></td>
                                        <td data-value="8"></td>
                                        <td data-value="9"></td>
                                        <td data-value="10"></td>
                                    </tr>
                                </table>
                                <div id="sliderKnob"></div>
                            </div>
                        </div>
                    </div>
                    <div class="scale-ends">
                        <strong>Ancient</strong>
                        {/* <!-- WEBSOCKET: Once the player votes, their vote will be broadcast using websocket. -->*/}
                        <form id="voteForm" method="get">
                            <input type="hidden" id="sliderValue" name="voteValue" value="5" />
                            <button class="submit-vote" type="submit">Submit Vote</button>
                        </form>
                        <strong>Modern</strong>
                    </div>
                </section>
            </div>
        </main>
    );
}