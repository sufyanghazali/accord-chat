if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet"); // Helmet helps you secure your Express apps by setting various HTTP headers.
const morgan = require("morgan");
const cors = require("cors");

// routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

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

app.listen(8080, async () => {
    console.log("Server up on port :8080")
})