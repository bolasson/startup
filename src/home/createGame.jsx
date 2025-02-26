import React from "react"
import PlayerList from "./playerList"

const samplePlayers = [
    { username: 'Alice' },
    { username: 'Bob' },
    { username: 'Charlie' },
    { username: 'David' },
    { username: 'Eve' },
    { username: 'Frank' },
    { username: 'Grace' },
    { username: 'Hank' },
]

export default function CreateGame() {
    return (
        <main>
            <form className="transparent-form" method="get" action="play" >
                <p>Head to <a href="https://startup.brycelasson.click" target="_blank">startup.brycelasson.click</a> and use the code below to join my game!</p>
                <input className="user-input" type="number" id="generatedCodeField" name="generatedCodeValue" value="5296" readOnly />
                <PlayerList players={samplePlayers}/>
                <button type="submit" style={{ width: 'auto' }} >Start Game</button>
            </form >
        </main>
    )
}