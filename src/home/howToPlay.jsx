import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HowToPlay() {
    const navigate = useNavigate();

    return (
        <main>
            <section>
                <h2>How To Play</h2>
                <ol>
                    <li>
                        Each round, a scale of 1 to 10 will be given with a word on each end (e.g., <strong>Ancient</strong> to <strong>Modern</strong>).
                    </li>
                    <li>One player will receive a random number and provide a clue that helps the other players guess the number.</li>
                    <li>Then, all other players must guess what number the player was given.</li>
                    <li>
                        The player with the most points wins. Players will get:
                        <ul>
                            <li><strong>3 points</strong> for an exact match.</li>
                            <li><strong>1 point</strong> for being 1 away from the correct answer.</li>
                        </ul>
                    </li>
                    <li>Play for as long or as short as you want!</li>
                </ol>
                <p>
                    You can create a new game and invite your friends or join an existing game using a code from your host. Once everyone has joined, the host will start the game.
                </p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button onClick={() => { navigate("/home/create-game") }} className="submit-vote" style={{ color: '#fff' }}>Create Game</button>
                    <button onClick={() => { navigate("/home/join-game") }} className="submit-vote" style={{ color: '#fff' }}>Join Game</button>
                </div>
            </section>
        </main>
    );
}