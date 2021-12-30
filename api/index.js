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
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

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

// keep track of online users - https://stackoverflow.com/questions/32134623/socket-io-determine-if-a-user-is-online-or-offline
//https://www.tutorialspoint.com/expressjs/expressjs_authentication.htm

io.use((socket, next) => {

    // if the session id exists, find it in store...
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.sessionID = sessionID;
            socket.user = session.user;
            return next();
        }
    }

    // ... if not, check if user authenticated...
    const user = socket.handshake.auth.user;
    if (!user) {
        return next(new Error("Invalid user"));
    }

    // ... then create new session
    socket.sessionID = randomId();
    socket.user = user;
    next();
})

// socket
io.on("connection", (socket) => {
    socket.join(socket.user._id);

    // server keeps track of online
    // "we are only retrieving th users of the current Socket.IO server (not suitable when scaling up)"
    const users = [];

    for (let [id, socket] of io.of("/").sockets) {
        users.push(socket.user.username);
    }

    // send all existing users to the client
    socket.emit("users", users);

    socket.emit("session", {
        sessionID: socket.sessionID,
        user: socket.user
    });


    // notify existing users that another user just connected
    socket.broadcast.emit("user connected", socket.user.username);

    socket.on("disconnect", () => {
        console.log("User has yeeted");
    });

    socket.on("chat message", ({ message, to }) => {
        socket.to(to).emit("chat message", {
            message,
            from: socket.id
        });
    });
});

server.listen(8080, async () => {
    console.log("Server up on port :8080");
});