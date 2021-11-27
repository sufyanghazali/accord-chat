import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import ChatOnline from "../../components/ChatOnline";
import axios from "axios";

const Messenger = () => {
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const { user } = useContext(AuthContext);

    // Send message
    const handleSubmit = async e => {
        e.preventDefault();
        const message = {
            conversation_id: currentChat._id,
            sender_id: user._id,
            message: newMessage
        };

        try {
            const res = await axios.post("/messages", message); // post new message
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
                                <button>Send</button>
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