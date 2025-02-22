import React from "react";
import "../styles.css";

export default function Home() {
    return (
        <main>
            {/* <!-- Tabs to determine which form is enabled. The how to play tab will be enabled by default --> */}
            {/* <!-- This reperesents the how to play tab of the form --> */}
            <section>
                {/* <!-- Replace Bryce with the user's username --> */}
                <h2>Hello Bryce, welcome to Rank It!</h2>
                <div className="tabs">
                    {/* <!-- When 'Create Game' is clicked, it will generate a code and populate the input field in the form below.  --> */}
                    {/* <!-- When a tab is clicked the corresponding form will pop up. Some buttons are currently disabled to display the styling for each active tab. --> */}
                    <button className="tab-link" disabled>How to Play</button>
                    <button className="tab-link">Create Game</button>
                    <button className="tab-link">Join Game</button>
                </div>
                <hr />
                <ol>
                    <li>Each round, a scale of 1 to 10 will be given with a word on each end (e.g., <strong>Ancient</strong> to <strong>Modern</strong>).</li>
                    <li>One player will receive a random number and provide a clue that helps the other players guess the number.</li>
                    <li>Then, all other players must guess what number the player was given.</li>
                    <li>The player with the most points wins. Players will get:
                        <ul>
                            <li><strong>3 points</strong> for an exact match.</li>
                            <li><strong>1 point</strong> for being 1 away from the correct answer.</li>
                        </ul>
                    </li>
                </ol>
                <p>You can create a new game and invite your friends or join an existing game using a code from your host. Once everyone has joined, the host will start the game.</p>
            </section>
            {/* <!-- This reperesents the create game tab of the form --> */}
            <section>
                <h2>Create New Game</h2>
                <div className="tabs">
                    {/* <!-- When 'Create Game' is clicked, it will generate a code and populate the input field in the form below.  --> */}
                    {/* <!-- When a tab is clicked the corresponding form will pop up.--> */}
                    <button className="tab-link">How to Play</button>
                    <button className="tab-link" disabled>Create Game</button>
                    <button className="tab-link">Join Game</button>
                </div>
                <hr />
                {/* <!-- Using the get method for now, so I can verify the form is working --> */}
                <form className="transparent-form" method="get" action="play">
                    <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                    <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value="5296" readonly />
                    {/* <!-- Update this list dynamically as players join --> */}
                    <ul>
                        <li style={{ background: '#00D2FF' }}>Bryce (Host)</li>
                        <li style={{ background: '#0FFF00' }}>Kyle</li>
                        <li style={{ background: '#a545ff' }}>Jessica</li>
                        <li style={{ background: '#ffff00' }}>Wayne</li>
                        <li style={{ background: '#FF9200' }}>Derek</li>
                        <li style={{ background: '#FF00EC' }}>Emily</li>
                        <li style={{ background: '#665bff' }}>Travis</li>
                        <li style={{ background: '#FF0010' }}>Nathan</li>
                    </ul>
                    <button type="submit" style={{ width: 'auto' }} >Start Game</button>
                </form>
            </section>
            <section>
                <h2>Join Existing Game</h2>
                <div className="tabs">
                    {/* <!-- When a tab is clicked the corresponding form will pop up.--> */}
                    <button className="tab-link">How to Play</button>
                    <button className="tab-link">Create Game</button>
                    <button className="tab-link" disabled>Join Game</button>
                </div>
                <hr />
                {/* <!-- Using the get method for now, so I can verify the form is working --> */}
                <form className="transparent-form" method="get" action="play">
                    <p>Enter the code from your host to join their game.</p>
                    <div className="form-field">
                        <input className="user-input" type="number" id="joinCodeField" name="joinCodeValue" placeholder="ie 5296" required />
                    </div>
                    <br />
                    <button type="submit" style={{ width: 'auto' }}>Join Game</button>
                </form>
            </section>
        </main>
    );
}