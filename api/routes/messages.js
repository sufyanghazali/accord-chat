const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// create message
router.post("/", (req, res) => {
    const newMessage = new Message(req.body);
    res.status(200).json(req.body);
});

module.exports = router;
