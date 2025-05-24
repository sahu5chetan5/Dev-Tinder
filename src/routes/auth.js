const express = require("express")
const {validateSignUpData} = require("../utils/validation")
const authRouter = express.Router();
const User = require("../models/user")
const bcrypt = require("bcrypt")


authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        
        const user = new User({
            firstName, lastName, emailId, password: passwordHash
        })
        const savedUser = await user.save()
        const token = await savedUser.getJWT();
        
        // Set cookie based on environment
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            expires: new Date(Date.now() + 8 * 3600000),
            httpOnly: true,
            path: '/',
            ...(isProduction ? {
                secure: true,
                sameSite: 'none',
                domain: '.onrender.com'
            } : {
                secure: false,
                sameSite: 'lax'
            })
        };
        
        res.cookie("token", token, cookieOptions)
        
        res.json({
            message: "User added successfully",
            data: savedUser,
            token
        })
    } catch(err) {
        res.status(400).json({ message: "ERROR: " + err.message })
    }
})

authRouter.post("/login", async(req, res) => {
    try {
        const {emailId, password} = req.body
        const user = await User.findOne({emailId: emailId})

        if (!user) {
            throw new Error("Opss!!! Invalid credentials")
        }
        
        const isPasswordValid = await user.validatePassword(password)
        
        if(isPasswordValid) { 
            const token = await user.getJWT();
            
            // Set cookie based on environment
            const isProduction = process.env.NODE_ENV === 'production';
            const cookieOptions = {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: true,
                path: '/',
                ...(isProduction ? {
                    secure: true,
                    sameSite: 'none',
                    domain: '.onrender.com'
                } : {
                    secure: false,
                    sameSite: 'lax'
                })
            };
            
            res.cookie("token", token, cookieOptions)
            
            res.json({
                user,
                token,
                message: "Login successful"
            })
        } else {
            throw new Error("Opss!!! Invalid credentials")
        }
    } catch(err) {
        res.status(400).json({ message: "ERROR: " + err.message })
    }
})


authRouter.post("/logout", async(req, res) => {
    try {
        // Set cookie based on environment
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            expires: new Date(0), // Set to past date to expire immediately
            httpOnly: true,
            path: '/',
            ...(isProduction ? {
                secure: true,
                sameSite: 'none',
                domain: '.onrender.com'
            } : {
                secure: false,
                sameSite: 'lax'
            })
        };
        
        // Clear both token and sessionid cookies
        res.clearCookie("token", cookieOptions);
        res.clearCookie("sessionid", cookieOptions);
        
        res.status(200).json({ message: "Logout Successful !!!" })
    } catch(err) {
        res.status(400).json({ message: "Error during logout: " + err.message })
    }
})



module.exports = authRouter