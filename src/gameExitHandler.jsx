import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGame } from "./customContext/gameContext";

export default function GameExitHandler() {
    const location = useLocation();
    const { activeGame, activeUser, leaveGame } = useGame();
    const prevLocationRef = useRef(location.pathname);

    useEffect(() => {
        const prevPath = prevLocationRef.current;
        const currentPath = location.pathname;

        const pageLevels = {
            "/home/join-game": 1,
            "/home/create-game": 1,
            "/home/waiting-room": 2,
            "/play": 2,
        };

        const prevLevel = pageLevels[prevPath] || 0;
        const currentLevel = pageLevels[currentPath] || 0;

        if (activeGame && activeUser && ((currentLevel === 0) || (prevLevel > currentLevel))) {
            leaveGame(activeGame.gameID, activeUser.userID);
        }

        prevLocationRef.current = currentPath;
    }, [location, activeGame, activeUser, leaveGame]);

    return null;
}