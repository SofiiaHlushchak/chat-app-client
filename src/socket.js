import { io } from "socket.io-client";

const API = process.env.REACT_APP_API_BASE_URL;

const socket = io(API, {
    withCredentials: true,
});

export default socket;
