const { WebSocketServer } = require('ws');

function gameProxy(httpServer) {
    const socketServer = new WebSocketServer({ server: httpServer });

    socketServer.on('connection', (socket) => {
        console.log('A new WS client connected to game proxy');
        socket.isAlive = true;
        socket.gameID = null;
        socket.on('message', (data) => {
            let msg;
            try {
                msg = JSON.parse(data);
            } catch (error) {
                console.error('Error parsing WS message:', error);
                return;
            }
            if (msg.type === 'subscribe' && msg.gameID) {
                socket.gameID = Number(msg.gameID);
                console.log(`Client subscribed to game ${msg.gameID}`);
            }
        });
        socket.on('pong', () => {
            socket.isAlive = true;
        });
    });

    const intervalId = setInterval(() => {
        socketServer.clients.forEach((client) => {
            if (client.isAlive === false) return client.terminate();
            client.isAlive = false;
            client.ping();
        });
    }, 10000);

    socketServer.on('close', () => {
        clearInterval(intervalId);
    });

    function broadcastGameUpdate(game) {
        const update = JSON.stringify({ type: 'game-update', game });
        socketServer.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.gameID === game.gameID) {
                client.send(update);
            }
        });
    }
    return { broadcastGameUpdate, socketServer };
}

module.exports = { gameProxy };