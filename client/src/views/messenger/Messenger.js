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

    // get a user's conversations
    // useEffect(() => {
    //     const getConversations = async () => {
    //         try {
    //             const res = await axios.get(`http://localhost:8080/user/${ user._id }/conversations`);
    //             console.log(res.data);
    //             setConversations(res.data);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     getConversations();
    // }, [user]);

    // get messages of current conversation
    // useEffect(() => {
    //     const getMessages = async () => {
    //         try {
    //             // "?." is called optional chaining.
    //             const messages = await axios.get(`http://localhost:8080/conversations/${ selectedUser?._id }`);
    //             setMessages(messages);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     getMessages();
    // }, [selectedUser])

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

        /*
        // post message to database
        try {
            const res = await axios.post("http://localhost:8080/messages", message); // post new message
            setMessages([...messages, res.data]); // update messages state
            setNewMessage(""); // empty chat input
        } catch (err) {
            console.log(err);
        }
        */
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
                                    <div>{message}</div>
                                ))}
                            </div>
                            <div className="chat-box-bottom">
                                {/* look into contenteditable divs */}
                                <textarea></textarea>
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