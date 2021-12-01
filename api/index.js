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
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const messagesRoute = require("./routes/messages");

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

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
        console.log("User has yeeted");
    });
});

server.listen(8080, async () => {
    console.log("Server up on port :8080");
});