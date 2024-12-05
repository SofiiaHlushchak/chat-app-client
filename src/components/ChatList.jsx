import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchChats, deleteChat } from "../actions/chatActions";
import icon from "../resources/img/user.png";

const ChatList = ({ onEditChat }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const chats = useSelector((state) => state.chats);

    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    const handleChatSelect = (chat) => {
        navigate(`/chat/${chat._id}`);
    };

    const handleDeleteChat = (chatId) => {
        dispatch(deleteChat({ chatId, navigate }));
    };

    if (!chats?.filteredChats?.length) {
        return (
            <div className="no-chats-message">
                <p>You currently have no available chats. Please create one.</p>
            </div>
        );
    }

    return (
        <div className="chat-list">
            <h2 className="chat-list__title">Chats</h2>
            <ul className="chat-list__items">
                {chats.filteredChats?.map((chat) => (
                    <li key={chat._id} className="chat-list__item">
                        <div
                            className="chat-list__item-content"
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="chat-list__item-main">
                                <img
                                    src={icon}
                                    alt="User Icon"
                                    className="icon"
                                />
                                <div className="chat-list__details">
                                    <div className="chat-list__name">
                                        <strong>
                                            {chat.firstName} {chat.lastName}
                                        </strong>
                                    </div>
                                    {chat.messages && (
                                        <div className="chat-list__last-message">
                                            {
                                                chat.messages[
                                                    chat.messages.length - 1
                                                ]?.text
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="chat-list__menu">
                                <div className="chat-list__menu-icon">
                                    &#x22EE;
                                </div>
                                <div className="chat-list__menu-actions">
                                    <button
                                        className="chat-list__menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditChat(chat);
                                        }}
                                    >
                                        <FaEdit title="Edit" />
                                    </button>
                                    <button
                                        className="chat-list__menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteChat(chat._id);
                                        }}
                                    >
                                        <FaTrash title="Delete" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
