const express = require("express")
const User = require("../models/user")
const profileRouter = express.Router()
const {userAuth} = require("../middleware/auth")
const {validateEditProfileData} = require("../utils/validation")


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        
        const user = req.user
        res.send(user)
    }catch(err){
        res.status(404).send("Error: "+err.message)
    }
        
    })


profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{    
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit request")
        };
 
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key])
        await loggedInUser.save()
        res.send(`${loggedInUser.firstName}, your profile has been updated successfully!!`)
    }catch(err){
        res.status(400).send("Error: "+err.message)
    }
})
module.exports = profileRouter