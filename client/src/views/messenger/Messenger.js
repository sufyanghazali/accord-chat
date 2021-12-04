import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import ChatOnline from "../../components/messenger/ChatOnline";
import Conversation from "../../components/messenger/Conversation";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/SocketContext";

const Messenger = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    // on connect to socket
    useEffect(() => {
        if (user)
            socket.connect();

        socket.on("connect", () => {
            console.log("client connected");
        });

        socket.on("users", users => setUsers(users));

        socket.on("user connected", user => setUsers([...users, user]))

    }, [socket, user, users]);

    // update MessageList component on message sent/received
    useEffect(() => {
        socket.on("chat message", message => {
            setMessages([...messages, message]);
        });
    }, [socket, messages])

    // get a user's conversations
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/user/${ user._id }/conversations`);
                console.log(res.data);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    }, [user]);

    // emit "add_user" when user change
    useEffect(() => {
        socket.emit("add user", user._id);
        // socket.on("get users", users => {
        //     set
        // })
    }, [socket, user]);

    // get messages of current conversation
    useEffect(() => {
        const getMessages = async () => {
            try {
                // "?." is called optional chaining.
                const messages = await axios.get(`http://localhost:8080/conversations/${ currentChat?._id }`);
                setMessages(messages);
            } catch (err) {
                console.log(err);
            }
        }
        getMessages();
    }, [currentChat])

    // Send message
    const handleSubmit = async e => {
        e.preventDefault();

        // create message
        const message = {
            conversation_id: currentChat?._id,
            sender_id: user._id,
            message: newMessage
        };

        // emit send message event - how does safak handle the event?
        // sender emit to server 
        // -> server emits to other users in chat
        // -> user receives event and message
        // -> adds to messages state
        // -> rerender messagelist component
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


    return (
        <div className="messenger">
            <div className="chat-menu">
                <div className="chat-menu-wrapper">
                    <input placeholder="Search for friends" />
                    {conversations.map(c => (
                        <div>
                            <Conversation conversation={c} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="chat-box">
                <div className="chat-box-wrapper">
                    {!currentChat ? (
                        <>
                            <div className="chat-box-top"></div>
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
            <div className="chat-online">
                <div className="chat-online-wrapper">
                    {users.map(user => (
                        <div>{user}</div>
                    ))}
                    {/* <ChatOnline /> */}
                </div>
            </div>
        </div>
    );
}

export default Messenger;