import React, { useState } from "react";
import SearchBar from "./SearchBar";
import icon from "../resources/img/user.png";

const SidebarHeader = ({ openModal, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        onSearch(e.target.value);
    };

    const onNewChat = () => {
        setSearchTerm("");
        onSearch("");
        openModal(null);
    };

    return (
        <div className="sidebar-header">
            <div className="sidebar-header__user-info">
                <img src={icon} alt="User Icon" className="icon" />
                <button className="main-button" onClick={onNewChat}>
                    New Chat
                </button>
            </div>
            <SearchBar onChange={handleSearchChange} value={searchTerm} />
        </div>
    );
};

export default SidebarHeader;
