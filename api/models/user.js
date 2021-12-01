const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    conversations: [{ type: Schema.Types.ObjectId, ref: "Conversation" }]
});

module.exports = mongoose.model("User", userSchema)