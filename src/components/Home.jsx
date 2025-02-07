// src/components/Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const navigate = useNavigate();

    const createRoom = async () => {
        if (!username) return alert("Please enter your name.");
        const response = await axios.get("https://chat-backend-jb9x.onrender.com/create-room");
        navigate(`/chat/${response.data.roomId}`, { state: { username } });
    };    

    const joinRoom = () => {
        if (roomId && username) {
            navigate(`/chat/${roomId}`, { state: { username } });
        } else {
            alert("Enter both Room ID and your name.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Chat Room 🚀</h2>
            <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br /><br />
            <button onClick={createRoom}>Create Room</button>
            <br /><br />
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={joinRoom}>Join Room</button>
        </div>
    );
};

export default Home;
