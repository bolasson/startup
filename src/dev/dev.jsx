import React, { useEffect, useState, useRef } from 'react';

export default function Dev() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const ws = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8080');
        ws.current.onopen = () => {
            console.log('Connected to WebSocket server!');
            setMessages(prev => [...prev, 'Connected to WebSocket server!']);
        };

        ws.current.onmessage = (event) => {
            console.log('Received:', event.data);
            setMessages(prev => [...prev, event.data]);
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(message);
            setMessage('');
        } else {
            console.error('WebSocket is not open.');
        }
    };

    return (
        <div>
            <h1>Dev Page: WebSocket Test</h1>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                <h2>Messages:</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
