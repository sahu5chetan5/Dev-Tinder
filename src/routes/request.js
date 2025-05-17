const express = require('express')

const requestRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{

        const fromUserId = req.user._id
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"]
        if (!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type :( " + status})
        }

        
        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message:"User not found"})
        }


        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId,
                    toUserId,
                },
                 {
                  fromUserId: toUserId,
                   toUserId: fromUserId
                }
            ]
           
        })
        if (existingConnectionRequest){
            return res.status(400).json({message:"Connection Request Already Exists!!"})
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })
        const data = await connectionRequest.save()
        res.json({
            message: req.user.firstName + " is " + status+" in "+toUser.firstName,
            data,
        })

    }catch(err){
        res.status(400).send("Error: " + err.message)        
    }


 
})



requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status is not allowed" });
        }

   
        const objectRequestId = new mongoose.Types.ObjectId(requestId);
        const objectUserId = new mongoose.Types.ObjectId(loggedInUser._id);

     

    
        const query = {
            _id: objectRequestId,
            toUserId: objectUserId,
            status: "interested",
        };
        console.log("Query being executed:", query);

        const connectionRequest = await ConnectionRequest.findOne(query);

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

      
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        return res.status(200).json({ message: `Connection request ${status}`, data });
    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            return res.status(400).json({ message: "Error: " + err.message });
        }
    }
});





module.exports = requestRouter

