if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const helmet = require("helmet"); // Helmet helps you secure your Express apps by setting various HTTP headers.
const morgan = require("morgan");
const cors = require("cors");

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const messagesRoute = require("./routes/messages");


// connect to database
mongoose.connect(process.env.MONGO_URL, () => {
    console.log("Connected to database");
});


// middleware
app.use(cors())
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/", authRoute);
app.use("/user", userRoute);
app.use("/messages", messagesRoute);


// socket
io.on("connection", (socket) => {
    // server keeps track of online
    // "we are only retrieving th users of the current Socket.IO server (not suitable when scaling up)"
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        users.push(id);
    }

    // notify existing users that another user just connected
    socket.broadcast.emit("user connected", socket.id);

    socket.emit("users", users);

    socket.on("disconnect", () => {
        console.log("User has yeeted");
    });

    socket.on("chat message", message => {
        console.log("server received message")
        io.emit("chat message", {
            ...message,
            yeet: "yeet"
        });
    });
});

server.listen(8080, async () => {
    console.log("Server up on port :8080");
});