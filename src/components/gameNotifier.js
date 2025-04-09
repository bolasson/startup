const GameEvent = {
    Update: "game-update",
};

class EventMessage {
    constructor(from, type, value) {
        this.from = from;
        this.type = type;
        this.value = value;
    }
}

class GameEventNotifier {
    constructor() {
        this.messageQueue = [];
        this.handlers = [];
        const protocol = window.location.protocol === "http:" ? "ws" : "wss";
        const host = window.location.hostname;
        const port = window.location.port;
        this.socket = new WebSocket(`${protocol}://${host}:${port}/ws`);

        this.socket.onopen = () => {
            console.log("GameEventNotifier: WebSocket connection opened");
            this.messageQueue.forEach((msg) => { this.socket.send(msg); console.log(msg); } );
            this.messageQueue = [];
        };

        this.socket.onmessage = async (msgEvent) => {
            let data = msgEvent.data;
            if (data instanceof Blob) {
                data = await data.text();
            }
            try {
                const event = JSON.parse(data);
                this.receiveEvent(event);
            } catch (error) {
                console.error("GameEventNotifier: Failed to parse incoming event", error);
            }
        };

        this.socket.onerror = (error) => {
            console.error("GameEventNotifier: WebSocket error", error);
        };

        this.socket.onclose = () => {
            console.log("GameEventNotifier: WebSocket connection closed");
        };
    }

    sendMessage(message) {
        const msgString = JSON.stringify(message);
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(msgString);
        } else {
            this.messageQueue.push(msgString);
        }
    }

    broadcastEvent(from, type, value) {
        const event = new EventMessage(from, type, value);
        this.sendMessage(event);
    }

    addHandler(handler) {
        this.handlers.push(handler);
    }

    removeHandler(handler) {
        this.handlers = this.handlers.filter((h) => h !== handler);
    }

    receiveEvent(event) {
        this.handlers.forEach((handler) => handler(event));
    }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier, EventMessage };  