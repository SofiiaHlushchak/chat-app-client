import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessages, sendMessage } from "../actions/chatActions";
import socket from "../socket";
import icon from "../resources/img/user.png";
import { format } from "date-fns";

const ChatWindow = () => {
    const { messages, chats } = useSelector(
        (state) => state.chats
    );
    const dispatch = useDispatch();
    const { chatId } = useParams();
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (chats.length && chats.every(chat => chat._id !== chatId)) {
            navigate(`/chat/${chats[0]._id}`);
        }
    }, [navigate, chats, chatId]);

    useEffect(() => {
        socket.on("connect", () => console.log("Socket connected:", socket.id));

        dispatch(fetchMessages(chatId));

        socket.on("newMessage", (newMessage) => {
            if (newMessage.chatId === chatId) {
                dispatch(fetchMessages(chatId));
                if (newMessage.sender === "BOT") {
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                }
            }
        });

        return () => socket.off("newMessage");
    }, [chatId, dispatch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleMessageSend = () => {
        if (message.trim()) {
            dispatch(sendMessage({ chatId, message }));
            setMessage("");
        }
    };

    const setActiveChat = (chatId) => {
        return chats.find((chat) => chat._id === chatId);
    };

    const activeChat = setActiveChat(chatId);

    if (!activeChat) {
        return <p>Please select a chat to start messaging.</p>;
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <img src={icon} alt="User Icon" className="icon" />
                <h2 className="chat-username">
                    {activeChat.firstName} {activeChat.lastName}
                </h2>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${
                            msg.sender === "USER" ? "user" : "bot"
                        }`}
                    >
                        <p>{msg.text}</p>
                        <span className="timestamp">
                            {format(
                                new Date(msg.timestamp),
                                "dd.MM.yyyy HH:mm"
                            )}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleMessageSend();
                        }
                    }}
                    placeholder="Type your message..."
                />
                <button onClick={handleMessageSend}>&#9658;</button>
            </div>
            {showToast && (
                <div className="toast">
                    <p>New message received!</p>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
