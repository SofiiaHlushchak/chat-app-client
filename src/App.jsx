import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import ChatForm from "./components/ChatForm";
import SidebarHeader from "./components/SidebarHeader";
import MainPage from "./components/MainPage";
import { filterChats } from "./reducers/slices/chatSlice";

const App = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [chatToEdit, setChatToEdit] = useState(null);

    const openModal = (chat = null) => {
        setChatToEdit(chat);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);
    const handleSearch = (searchTerm) => {
        dispatch(filterChats(searchTerm));
    };
    return (
        <div>
            <div className="container">
                <div className="sidebar">
                    <SidebarHeader
                        openModal={openModal}
                        onSearch={handleSearch}
                    />

                    <ChatList onEditChat={(chat) => openModal(chat)} />
                </div>
                <div className="chat-area">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/chat/:chatId" element={<ChatWindow />} />
                    </Routes>
                </div>
            </div>
            {isModalOpen && (
                <ChatForm toggleModal={closeModal} chatToEdit={chatToEdit} />
            )}
        </div>
    );
};

export default App;
