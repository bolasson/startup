import React from 'react';
import './styles.css';

export default function App() {
    return (
        <div className='body bg-dark text-light'>
            <div className="bg">
                <div className="moving-stars image1"></div>
                <div className="moving-stars image2"></div>
                <div className="moving-stars image3"></div>
            </div>
            <header>
                <div className="logo-container">
                    <img src="../images/logo.png" alt="Logo" width="75" />
                    <h1>Rank It</h1>
                </div>
                <nav>
                    <menu>
                        <li><a href="./login/login.html">Home</a></li>
                        <li><a href="./home/create_or_join.html">Create/Join Game</a></li>
                        <li><a href="./stats/statistics.html">My Stats</a></li>
                    </menu>
                </nav>
            </header>

            <main>App components go here</main>

            <footer>
                <span>Bryce Lasson</span>
                <a href="https://github.com/bolasson/startup.git" target="_blank">GitHub Repository</a>
            </footer>
        </div>
    );
}