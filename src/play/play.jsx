import React, { useState, useEffect, useRef } from "react";
import "../styles.css";

export default function Play() {

    const [sliderValue, setSliderValue] = useState(5);
    const [dragging, setDragging] = useState(false);
    const sliderContainerRef = useRef(null);
    const sliderKnobRef = useRef(null);
    const sliderCellsRef = useRef([]);
    
    let tableWidth, cellWidth, minX, maxX;
    const totalCells = 10;

    useEffect(() => {
        updateDimensions();
        updateSliderFromPosition((sliderValue - 0.5) * cellWidth);

        const handleMouseMove = (e) => {
            if (!dragging) return;
            const tableRect = sliderContainerRef.current.querySelector("table.slider").getBoundingClientRect();
            const x = e.clientX - tableRect.left;
            updateSliderFromPosition(x);
        };

        const handleTouchMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            const tableRect = sliderContainerRef.current.querySelector("table.slider").getBoundingClientRect();
            const x = e.touches[0].clientX - tableRect.left;
            updateSliderFromPosition(x);
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [dragging]);

    function updateDimensions() {
        if (!sliderContainerRef.current) return;
        const sliderTable = sliderContainerRef.current.querySelector("table.slider");
        tableWidth = sliderTable.offsetWidth;
        cellWidth = tableWidth / totalCells;
        minX = cellWidth / 2;
        maxX = tableWidth - cellWidth / 2;
    }

    function updateSliderFromPosition(x) {
        updateDimensions();
        
        if (x < minX) x = minX;
        if (x > maxX) x = maxX;
        
        let value = Math.round((x - minX) / cellWidth) + 1;
        value = Math.max(1, Math.min(totalCells, value));
        
        const snappedX = (value - 1) * cellWidth + minX;
        if (sliderKnobRef.current) {
            sliderKnobRef.current.style.left = `${snappedX}px`;
        }
        
        setSliderValue(value);
        
        if (sliderCellsRef.current.length > 0) {
            sliderCellsRef.current.forEach(cell => {
                cell.classList.remove("active", "partial");
                const cellValue = parseInt(cell.getAttribute("data-value"), 10);
                if (cellValue < value) {
                    cell.classList.add("active");
                } else if (cellValue === value) {
                    cell.classList.add("partial");
                }
            });
        }
    }

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
                            </tbody>
                        </table>
                        {/* <!-- The Table-Based Slider (patent pending) -->*/}
                        {/* <!-- This eldritch abomination of a slider is because the regular input range slider didn't have the custimization I wanted, and capabillites for perfectly lining up other elements with the tickmarks. The obvious solution? Build an entirely new type of input component that will be a glorious combination of the table element, CSS, and JavaScript. I will document it well. -->*/}
                        <div className="slider-container" ref={sliderContainerRef}>
                            {/* <!-- This table contains the labels to match up with the slider. It is optional-->*/}
                            <table className="slider-labels">
                                <tbody>
                                    <tr>
                                        {[...Array(10)].map((_, i) => (
                                            <td key={i}>{i + 1}</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            {/* <!-- This div is the input range slider replacement. Each td represents a possible value on the slider, and the div is the knob used to control it. -->*/}
                            <div id="sliderContainer">
                                <table className="slider">
                                    <tbody>
                                        <tr>
                                            {[...Array(10)].map((_, i) => (
                                                <td
                                                    key={i}
                                                    data-value={i + 1}
                                                    ref={el => sliderCellsRef.current[i] = el}
                                                ></td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                                <div id="sliderKnob" ref={sliderKnobRef} onMouseDown={() => setDragging(true)} onTouchStart={() => setDragging(true)}></div>
                            </div>
                        </div>
                    </div>
                    <div className="scale-ends">
                        <strong>Ancient</strong>
                        {/* <!-- WEBSOCKET: Once the player votes, their vote will be broadcast using websocket. -->*/}
                        <form id="voteForm" method="get">
                            <input type="hidden" id="sliderValue" name="voteValue" value="5" />
                            <button className="submit-vote" type="submit">Submit Vote</button>
                        </form>
                        <strong>Modern</strong>
                    </div>
                </section>
            </div>
        </main>
    );
}