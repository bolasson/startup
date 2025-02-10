import React from "react";
import { NavLink } from "react-router-dom";

export default function NotFound() {
    return (
        <main>
            <section style={{ textAlign: 'center', padding: '2em', gap: '1em' }}>
                Error 404: The page you're looking for could not be found, or it does not exist.
                <NavLink className='nav-link' to='/home'>Return to Home</NavLink>
            </section>
        </main>
    );
}