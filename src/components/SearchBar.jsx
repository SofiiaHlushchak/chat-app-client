import React from "react";

const SearchBar = ({ onChange, value }) => {
    return (
        <input
            type="text"
            placeholder="Search or start new chat"
            value={value}
            onChange={onChange}
            className="search-bar"
        />
    );
};

export default SearchBar;
