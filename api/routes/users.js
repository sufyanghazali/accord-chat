const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Conversation = require("../models/conversation");

// READ
router.get("/:id", async (req, res) => {
    console.log("We out here");
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

// UPDATE - Add friend
router.put("/:friendId/follow", async (req, res) => {
    const { userId } = req.body;
    const { friendId } = req.params;

    if (userId !== friendId) {
        try {
            const user = await User.findById(userId);
            const friend = await User.findById(friendId);

            // if person is not already a friend, add each other
            if (!user.friends.includes(friendId)) {
                // $push operator appends a specified value to an array
                await user.updateOne({ $push: { friends: friendId } });
                await friend.updateOne({ $push: { friends: userId } });
                res.status(200).json("You guys are now friends")
            } else {
                res.status(403).json("You are already friends with this person")
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Get some friends");
    }
});

// DELETE
router.put("/:friendId/unfollow", async (req, res) => {
    const { userId } = req.body;
    const { friendId } = req.params;

    if (userId !== friendId) {
        try {
            const user = await User.findById(userId);
            const friend = await User.findById(friendId);

            if (user.friends.includes(id)) {
                // $push operator appends a specified value to an array
                await user.updateOne({ $pull: { friendS: friendId } });
                await friend.updateOne({ $pull: { friends: userId } });
                res.status(200).json("You guys aren't friends anymore");
            } else {
                res.status(403).json("You guys aren't even friends");
            }
        } catch (er) {
            res.status(500).json(err);
        }
    } else {
        // status code 403 = forbidden
        res.status(403).json("You can't unfriend yourself...");
    }
});

// Get user's conversations 
router.get("/:id/conversations", async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.params.id] }
        });

        // alternative query
        // const user = await User.findById(req.params.id)
        //     .populate({
        //         path: "conversations"
        //     });
        res.status(200).json(conversations);
    } catch (err) {
        console.log(err);
    }
});


/*
const conversations = await Conversation.find({
    participants:{$all: [user._id, friend._id]}
})

or store the conversations/rooms in user?
*/



module.exports = router;