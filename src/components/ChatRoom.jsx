// src/components/ChatRoom.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://chat-backend.onrender.com");

const ChatRoom = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const username = location.state?.username || "Guest";
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Join the room when the component mounts
        socket.emit("join-room", { room: roomId, username });

        // Listen for messages
        socket.on("receive-message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        // Notify when a user joins
        socket.on("user-joined", (data) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { username: "System", message: `${data.username} joined the room.` },
            ]);
        });

        // Cleanup on unmount
        return () => {
            socket.off("receive-message");
            socket.off("user-joined");
        };
    }, [roomId]);

    const sendMessage = () => {
        if (message.trim() !== "") {
            socket.emit("send-message", { room: roomId, username, message });
            setMessage("");
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <h2>Room ID: {roomId}</h2>
            <div
                style={{
                    height: "300px",
                    overflowY: "scroll",
                    border: "1px solid #ddd",
                    padding: "10px",
                    margin: "10px auto",
                    width: "50%",
                }}
            >
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.username}: </strong>
                        {msg.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
