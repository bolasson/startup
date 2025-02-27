import React, { useEffect } from 'react';
import Leaderboard from '../play/leaderboard';
import useGameLogic from "../customHooks/useGameLogic.jsx";
import { useGame } from "../customContext/gameContext";

export default function Dev() {

    const { nextRound } = useGameLogic();
    const { game } = useGame();

    useEffect (() => {
        console.log('game: ', game);
    }, [game]);

    return (
        <div>
            <h1>Dev Page: Leaderboard Test</h1>
            <Leaderboard />
            <button onClick={nextRound}>Next Round</button>
        </div>
    );
}
