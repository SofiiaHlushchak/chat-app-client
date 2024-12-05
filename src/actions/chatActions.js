import axios from "axios";
import socket from "../socket";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setChats } from "../reducers/slices/chatSlice";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchChats = createAsyncThunk(
    "chats/fetchChats",
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/chats`);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchMessages = createAsyncThunk(
    "chats/fetchMessages",
    async (chatId) => {
        const response = await axios.get(`${API_BASE_URL}/api/chats/${chatId}`);
        return { messages: response.data.messages, chatId };
    }
);

export const sendMessage = createAsyncThunk(
    "chats/sendMessage",
    async ({ chatId, message }, { dispatch }) => {
        try {
            const newMessage = { chatId, text: message, sender: "USER" };

            await axios.post(`${API_BASE_URL}/api/messages/send`, newMessage);

            socket.emit("sendMessage", newMessage);

            dispatch(fetchMessages(chatId));
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }
);

export const deleteChat = createAsyncThunk(
    "chats/deleteChat",
    async ({ chatId, navigate }, { dispatch }) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this chat?"
        );

        if (!confirmDelete) {
            return;
        }

        await axios.delete(`${API_BASE_URL}/api/chats/${chatId}`);

        const response = await axios.get(`${API_BASE_URL}/api/chats`);
        const updatedChats = response.data;

        dispatch(setChats(updatedChats));

        if (!updatedChats.length) {
            navigate("/");
        }

        return chatId;
    }
);

export const createChat = createAsyncThunk(
    "chats/createChat",
    async ({ firstName, lastName, navigate }, { dispatch }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/chats`, {
                firstName,
                lastName,
            });
            const newChatId = response.data._id;
            navigate(`/chat/${newChatId}`);

            return response.data;
        } catch (error) {
            console.error("Error creating chat:", error);
            throw error;
        }
    }
);

export const updateChat = createAsyncThunk(
    "chats/updateChat",
    async ({ chatId, firstName, lastName }) => {
        const response = await axios.put(
            `${API_BASE_URL}/api/chats/${chatId}`,
            {
                firstName,
                lastName,
            }
        );
        return response.data;
    }
);
