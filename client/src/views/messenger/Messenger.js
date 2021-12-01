import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import ChatOnline from "../../components/messenger/ChatOnline";
import Conversation from "../../components/messenger/Conversation";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/socket";

const Messenger = () => {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([])
    const [receivedMessage, setReceivedMessage] = useState(null);
    const { user } = useContext(AuthContext);
    const socket = useContext(SocketContext);

    // connect to socket
    useEffect(() => {
        socket.on("connect", () => {
            console.log("client connected");
        })
    }, [socket]);

    // get a user's conversations
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/user/${ user._id }/conversations`);
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

    // get messages for current conversation
    useEffect(() => {
        const getMessages = async () => {
            try {
                // "?." is called optional chaining.
                const messages = await axios.get(`http://localhost:8080/conversations/${ currentChat?._id }`)
            } catch (err) {
                console.log(err);
            }
        }
    })

    // Send message
    const handleSubmit = async e => {
        e.preventDefault();

        // create message
        const message = {
            conversation_id: currentChat._id,
            sender_id: user._id,
            message: newMessage
        };

        // emit send message event - how does safak handle the event?
        // sender emit to server 
        // -> server emits to other users in chat
        // -> user receives event and message
        // -> adds to messages state
        // -> rerender messagelist component


        // post message to database
        try {
            const res = await axios.post("http://localhost:8080/messages", message); // post new message
            setMessages([...messages, res.data]); // update messages state
            setNewMessage(""); // empty chat input
        } catch (err) {
            console.log(err);
        }
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
                    <ChatOnline />
                </div>
            </div>
        </div>
    );
}

export default Messenger;