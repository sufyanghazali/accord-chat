const mongoose = require("mongoose");
const { Schema } = mongoose;

const conversationSchema = new Schema({
    name: String,
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);