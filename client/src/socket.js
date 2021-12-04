import { io } from "socket.io-client";

const URL = "http://localhost:8080";
const socket = io(URL, { autoConnect: false }); // autoconnect is set to false so the connection is not established right away. We will manually call socket.connect() later.

// register catch-all listener so that any event received by the client will be printed in the console
socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;