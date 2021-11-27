const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { route } = require("./auth");

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
router.put("/:id/follow", async (req, res) => {
    const { userId } = req.body;
    const { friendId } = req.params;

    if (userId !== friendId) {
        try {
            const user = await User.findById(userId);
            const friend = await User.findById(friendId);

            // if person is not already a friend, add each other
            if (!user.friends.includes(friendId)) {
                // $push operator appends a specified value to an array
                await user.updateOne({ $push: { friends: id } });
                await friend.updateOne({ $push: { friends: userId } });
                res.status(200).json("You guys are now friends")
            } else {
                res.status(403).json("You are already friends with this person")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("Get some friends");
    }
});

// DELETE
router.put("/:id/unfollow", async (req, res) => {
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

module.exports = router;