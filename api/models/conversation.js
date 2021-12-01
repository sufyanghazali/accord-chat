const mongoose = require("mongoose");
const { Schema } = mongoose;

// not storing messages in Conversation because that's gonna be a lot of messages
const conversationSchema = new Schema({
    name: String,
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);