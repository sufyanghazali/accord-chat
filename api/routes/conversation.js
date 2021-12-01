const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const Message = require("../models/message");

// get conversation 
router.get("/:conversationId", (req, res) => {
    try {
        const conversation = Conversation.findById(req.params.conversationId)
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get conversation's messages 
router.get("/:conversationId/messages", (req, res) => {
    try {
        const messages = Message.find({
            conversation_id: req.params.conversationId
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;