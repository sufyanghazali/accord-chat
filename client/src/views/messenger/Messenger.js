import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import ChatOnline from "../../components/messenger/ChatOnline";
import Conversation from "../../components/messenger/Conversation";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";

import "./messenger.css";

const Messenger = () => {
    // const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    // on connect to socket
    useEffect(() => {
        const sessionID = localStorage.getItem("sessionID");

        if (sessionID) {
            socket.auth = { sessionID };
            socket.connect();
        }

        if (user) {
            socket.auth = { user }; // send credentials to server
            socket.connect();
        }

        socket.on("connect", () => {
            console.log("client connected");
        });

        socket.on("users", users => setUsers(users));

        socket.on("user connected", user => setUsers([...users, user]));

        socket.on("session", ({ sessionID, user }) => {
            socket.auth = { sessionID };
            localStorage.setItem("sessionID", sessionID);
            socket.user = user;
        })

    }, [socket, user, users]);

    // update MessageList component on message sent/received
    useEffect(() => {
        socket.on("chat message", message => {
            setMessages([...messages, message]);
        });
    }, [socket, messages])

    // Send message
    const handleSubmit = async e => {
        e.preventDefault();

        // create message
        const message = {
            to: selectedUser,
            sender_id: user._id,
            message: newMessage
        };

        //push to messages array
        setMessages([...messages, message]);
        setNewMessage("");

        socket.emit("chat message", message);
    }

    const handleChange = e => {
        setNewMessage(e.target.value);
    }

    const handleSelectUser = user => {
        setSelectedUser(user);
    }

    return (
        <div className="messenger">
            <div className="users">
                {users.map(user => (
                    <div onClick={() => handleSelectUser(user)} key={user._id}>{user}</div>
                ))}
            </div>
            <div className="chat-box">
                <div className="chat-box-wrapper">
                    {selectedUser ? (
                        <>
                            <div className="chat-box-top">
                                {messages.map(message => (
                                    <div>{message.message}</div>
                                ))}
                            </div>
                            <div className="chat-box-bottom">
                                {/* look into contenteditable divs */}
                                <textarea onChange={handleChange} value={newMessage}></textarea>
                                <button onClick={handleSubmit}>Send</button>
                            </div>
                        </>
                    ) : (
                        <span>Open a conversation to start a chat</span>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Messenger;