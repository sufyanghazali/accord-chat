const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
    conversation_id: {
        type: Schema.Types.ObjectId, ref: "Conversation"
    },
    sender_id: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    message: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);