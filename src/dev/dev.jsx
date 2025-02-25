import React from 'react';
import useTimer from '../custom_hooks/use_timer';

export default function Dev() {
    const { time, startTimer, pauseTimer, resetTimer } = useTimer(10);

    return (
        <div>
            <h1>Timer: {time} seconds</h1>
            <button onClick={startTimer}>Start</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={resetTimer}>Reset</button>
        </div>
    );
}
