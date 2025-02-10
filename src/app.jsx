import React from 'react';
import './styles.css';
import Login from './login/login.jsx';
import Home from './home/home.jsx';
import Play from './play/play.jsx';
import Stats from './stats/stats.jsx';
import NotFound from './404/not_found.jsx';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

export default function App() {
    return (
        <BrowserRouter>
            <div className='body text-light'>
                <div className="bg">
                    <div className="moving-stars image1"></div>
                    <div className="moving-stars image2"></div>
                    <div className="moving-stars image3"></div>
                </div>
                <header>
                    <div className="logo-container">
                        <img src="/logo.png" alt="Logo" width="75" />
                        <h1>Rank It</h1>
                    </div>
                    <nav>
                        <menu>
                            <li><NavLink className='nav-link' to='/'>Login</NavLink></li>
                            <li><NavLink className='nav-link' to='home'>Home</NavLink></li>
                            <li><NavLink className='nav-link' to='stats'>My Stats</NavLink></li>
                        </menu>
                    </nav>
                </header>
                <Routes>
                    <Route path='/' element={<Login />}  exact/>
                    <Route path='home' element={<Home />} />
                    <Route path='play' element={<Play />} />
                    <Route path='stats' element={<Stats />} />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <footer>
                    <span style={{ marginRight: '1rem'}}>Bryce Lasson</span>
                    <a href="https://github.com/bolasson/startup.git" target="_blank">GitHub Repository</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}