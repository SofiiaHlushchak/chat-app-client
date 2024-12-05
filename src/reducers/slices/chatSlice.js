import { createSlice } from "@reduxjs/toolkit";
import {
    fetchChats,
    fetchMessages,
    sendMessage,
    deleteChat,
    createChat,
    updateChat,
} from "../../actions/chatActions";

const initialState = {
    chats: [],
    filteredChats: [],
    messages: [],
    lastMessage: null,
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chats",
    initialState,
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
            state.filteredChats = action.payload;
        },
        setFilteredChats: (state, action) => {
            state.filteredChats = action.payload;
        },
        filterChats: (state, action) => {
            const searchTerm = action.payload.toLowerCase();
            const filtered = state.chats.filter(
                (chat) =>
                    chat.firstName.toLowerCase().includes(searchTerm) ||
                    chat.lastName.toLowerCase().includes(searchTerm)
            );
            state.filteredChats = filtered;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
                state.filteredChats = action.payload;
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                const remainingChats = state.chats.filter(
                    (chat) => chat._id !== action.payload
                );
                state.chats = remainingChats;
                state.filteredChats = state.filteredChats.filter(
                    (chat) => chat._id !== action.payload
                );
            })
            .addCase(updateChat.fulfilled, (state, action) => {
                state.chats = state.chats.map((chat) =>
                    chat._id === action.payload._id ? action.payload : chat
                );

                state.filteredChats = state.filteredChats.map((chat) =>
                    chat._id === action.payload._id ? action.payload : chat
                );
            })
            .addCase(createChat.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.chats.push(action.payload);
                state.filteredChats = state.chats;

                state.searchTerm = "";
            })
            .addCase(createChat.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload.messages;
                state.lastMessage = action.payload.messages[action.payload.messages.length - 1];
                state.filteredChats = state.filteredChats.map(item => {
                    if (item._id === action.payload.chatId) {
                        item.messages = action.payload.messages;
                    }

                    return item;
                });
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setFilteredChats, filterChats, setChats } = chatSlice.actions;

export default chatSlice.reducer;
