import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../customContext/gameContext';

export default function HowToPlay() {
    const navigate = useNavigate();
    const { activeUser } = useGame();

    return (
        <main>
            <section>
                <h2>Hello{activeUser && " " + activeUser.name}, welcome to Rank It!</h2>
                <ol>
                    <li>
                        Each round, a scale of 1 to 10 will be given with a word on each end (e.g., <strong>Ancient</strong> to <strong>Futuristic</strong>).
                    </li>
                    <li>One player will receive a random number and provide a clue that helps the other players guess the number.</li>
                    <li> Players will receive:
                        <br />• <strong>3 points</strong> for an exact match
                        <br />• <strong>1 point</strong> for being 1 away from the correct answer
                        <br />• <strong>1 point</strong> for every player that guesses their clue correctly
                    </li>
                    <li>Play for as long or as short as you want!</li>
                </ol>
                {activeUser ? <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                    <button onClick={() => { navigate("/home/create-game") }} className="submit-vote" style={{ color: '#fff' }}>Create Game</button>
                    <button onClick={() => { navigate("/home/join-game") }} className="submit-vote" style={{ color: '#fff' }}>Join Game</button>
                </div> : 
                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                    <button onClick={() => { navigate("/") }} className="submit-vote" style={{ color: '#fff' }}>Login</button>
                </div>}
            </section>
        </main>
    );
}