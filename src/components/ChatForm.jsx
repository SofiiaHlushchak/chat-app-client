import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createChat, updateChat } from "../actions/chatActions";
import { useNavigate } from "react-router-dom";

const ChatForm = ({ toggleModal, chatToEdit = null }) => {
    const [firstName, setFirstName] = useState(chatToEdit?.firstName || "");
    const [lastName, setLastName] = useState(chatToEdit?.lastName || "");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        const chatData = { firstName, lastName };

        if (chatToEdit) {
            dispatch(updateChat({ chatId: chatToEdit._id, ...chatData }))
                .then(() => {
                    toggleModal();
                })
                .catch((error) => {
                    console.error("Error updating chat:", error);
                });
        } else {
            dispatch(createChat({ firstName, lastName, navigate }))
                .then(() => {
                    setFirstName("");
                    setLastName("");
                    toggleModal();
                })
                .catch((error) => {
                    console.error("Error creating chat:", error);
                });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">
                    {chatToEdit ? "Edit Chat" : "Create New Chat"}
                </h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <div className="modal-buttons">
                        <button type="submit" className="main-button">
                            {chatToEdit ? "Update Chat" : "Create Chat"}
                        </button>
                        <button
                            type="button"
                            onClick={toggleModal}
                            className="main-button"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatForm;
