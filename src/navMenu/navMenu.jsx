import React from 'react';
import { NavLink } from 'react-router-dom';
import { useGame } from '../customContext/gameContext.jsx';
import '../styles.css';

export default function NavMenu() {
    const { activeUser } = useGame();
    
    if (activeUser == null) {
        return (
            <nav>
                <menu>
                    <li><NavLink className='nav-link' to='/'>Login</NavLink></li>
                    <li><NavLink className='nav-link' to='home'>Home</NavLink></li>
                </menu>
            </nav>
        );    
    }   

    return (
        <nav>
            <menu>
                <li><NavLink className='nav-link' to='home'>Home</NavLink></li>
                <li><NavLink className='nav-link' to='stats'>Stats</NavLink></li>
                <li><NavLink className='nav-link' to='logout'>Logout</NavLink></li>
            </menu>
        </nav>
    );
}