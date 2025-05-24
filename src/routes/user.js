const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router()
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"
const User = require("../models/user")

//get all the pending connection request for the loggedin user
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA)

        // Ensure skills array exists for each user
        const requestsWithSkills = connectionRequest.map(request => ({
            ...request.toObject(),
            fromUserId: {
                ...request.fromUserId.toObject(),
                skills: request.fromUserId.skills || []
            }
        }))

        res.status(200).json({
            message: "data fetched successfully",
            data: requestsWithSkills
        })
    } catch(err) {
        res.status(400).json({ message: "Error: " + err.message })
    }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequest.map(row => {
            const otherUser = row.fromUserId._id.toString() === loggedInUser._id.toString() 
                ? row.toUserId 
                : row.fromUserId;
            
            return {
                ...otherUser.toObject(),
                skills: otherUser.skills || []
            };
        })

        res.status(200).json({
            message: "Connections fetched successfully",
            data: data
        })
    } catch(err) {
        res.status(400).json({ message: "Error: " + err.message })
    }
})

userRouter.get("/feed", userAuth, async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit
        const skip = (page - 1) * limit

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()

        connectionRequest.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
   
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)
        .lean()

        // Ensure skills array exists for each user
        const usersWithSkills = users.map(user => ({
            ...user,
            skills: user.skills || []
        }))

        res.status(200).json({
            message: "Feed data fetched successfully",
            data: usersWithSkills
        })
    } catch(err) {
        res.status(400).json({ message: "Error: " + err.message })
    }
})

module.exports = userRouter; 