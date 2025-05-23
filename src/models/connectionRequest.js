const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status:{
        type: String,
        required:true,
        enum: {
            values:["ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`
        } 
    }
},
{
    timestamps: true,
})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    //check if the fromuserid same as touserid
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself")
    }
    next();
})


const connectionRequest = new mongoose.model("connectionRequest",connectionRequestSchema)
module.exports = connectionRequest;