const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
    console.log('A new client connected!');
    socket.send('Welcome to the WebSocket server!');
    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`${message}`);
            }
        });
    });
});