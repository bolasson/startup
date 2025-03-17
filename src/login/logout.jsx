import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../customContext/gameContext";
import "../styles.css";

export default function Logout() {
    const navigate = useNavigate();
    const { setUser } = useGame();

    function logout() {
        fetch('api/user', {
            method: 'DELETE',
        })
        .finally(() => {
            setUser(null);
            navigate('/');
        });
    }

    useEffect(() => {
        logout();
    }, []);

    return (
        <main>
            <section className="intro">
                <h2>Logging out...</h2>
            </section>
        </main>
    );
}