const express = require("express")
const User = require("../models/user")
const profileRouter = express.Router()
const {userAuth} = require("../middleware/auth")

profileRouter.get("/profile",userAuth,async(req,res)=>{
    try{
        
        const user = req.user
        res.send(user)
    }catch(err){
        res.status(404).send("Error: "+err.message)
    }
        
    })

module.exports = profileRouter