import { useState, useRef, useEffect } from 'react';

export default function useTimer(initialTime = 10) {
    const [time, setTime] = useState(initialTime);
    const intervalRef = useRef(null);

    const startTimer = () => {

        if (intervalRef.current !== null) return;

        intervalRef.current = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTimer = () => {
        pauseTimer();
        setTime(initialTime);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { time, startTimer, pauseTimer, resetTimer };
}
