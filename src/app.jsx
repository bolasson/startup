import React from 'react';
import './styles.css';
import Login from './login/login.jsx';
import Logout from './login/logout.jsx';
import Play from './play/play.jsx';
import Stats from './stats/stats.jsx';
import NotFound from './404/not_found.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GameProvider } from './customContext/gameContext.jsx';
import GameExitHandler from './gameExitHandler.jsx';
import NavMenu from './navMenu/navMenu.jsx';
import HowToPlay from './home/howToPlay.jsx';
import CreateGame from './home/createNewGame.jsx';
import JoinGame from './home/joinGame.jsx';
import WaitingRoom from './home/waitingRoom.jsx';

export default function App() {
    return (
        <GameProvider>
            <BrowserRouter>
                <GameExitHandler />
                <div className='body text-light'>
                    <div className="bg">
                        <div className="moving-stars image1"></div>
                        <div className="moving-stars image2"></div>
                        <div className="moving-stars image3"></div>
                    </div>
                    <header>
                        <div className="logo-container">
                            <img src="/logo.png" alt="Logo" width={75} height={75} />
                            <h1>Rank It</h1>
                        </div>
                        <NavMenu />
                    </header>
                    <Routes>
                        <Route path='/' element={<Login />} exact />
                        <Route path='home/create-game' element={<CreateGame />} />
                        <Route path='home/join-game' element={<JoinGame />} />
                        <Route path='home/waiting-room' element={<WaitingRoom />} />
                        <Route path='home' element={<HowToPlay />} />
                        <Route path='play' element={<Play />} />
                        <Route path='stats' element={<Stats />} />
                        <Route path='logout' element={<Logout />} />
                        <Route path='*' element={<NotFound />} />
                    </Routes>
                    <footer>
                        <span style={{ marginRight: '1rem' }}>Bryce Lasson</span>
                        <a href="https://github.com/bolasson/startup.git" target="_blank">GitHub Repository</a>
                    </footer>
                </div>
            </BrowserRouter>
        </GameProvider>
    );
}