import React, { useState } from "react";
import "../styles.css";

export default function Home() {

    const welcomeMessage = "Hello Bryce, welcome to Rank It!";

    const [activeTab, setActiveTab] = useState(<HowToPlay />);
    const [tabTitle, setTabTitle] = useState(welcomeMessage);

    function changeTab(title, component) {
        setTabTitle(title);
        setActiveTab(component);
    }

    return (
        <main>
            <section>
                <h2>{tabTitle}</h2>
                {/* <!-- Replace Bryce with the user's username --> */}
                <div className="tabs">
                    <button className="tab-link" onClick={() => { changeTab(welcomeMessage, <HowToPlay />) }}>How to Play</button>
                    <button className="tab-link" onClick={() => { changeTab('Create a Game', <CreateGame />) }} >Create Game</button>
                    <button className="tab-link" onClick={() => { changeTab('Join a Game', <JoinGame changeTab={changeTab} />) }} >Join Game</button>
                </div>
                <hr />
                {activeTab}
            </section>
        </main>
    );
}

function HowToPlay() {
    return (
        <>
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
        </>
    );
}

function CreateGame() {
    return (
        <>
            {/* <!-- Using the get method for now, so I can verify the form is working --> */}
            <form className="transparent-form" method="get" action="play" >
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value="5296" readOnly />
                <PlayerList />
                <button type="submit" style={{ width: 'auto' }} >Start Game</button>
            </form >
        </>
    )
}

function PlayerList() {
    return (
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
    )
}

function JoinGame({ changeTab }) {
    return (
        <>
            <p>Enter the code from your host to join their game.</p>
            <div className="form-field">
                <input className="user-input" type="number" id="joinCodeField" name="joinCodeValue" placeholder="ie 5296" required />
            </div>
            <br />
            <button className="submit-vote" onClick={() => { changeTab('Waiting Room', <WaitingRoom />) }} style={{ width: 'auto' }}>Join Game</button>
        </>
    )
}

function WaitingRoom() {
    return (
        <>
            <p>Waiting for the host to start the game...</p>
            <form className="transparent-form" >
                <PlayerList />
            </form>
        </>
    )
}