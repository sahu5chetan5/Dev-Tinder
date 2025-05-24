const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        // Try to get token from cookie first, then from Authorization header
        const token = req.cookies.token || 
                     (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                        ? req.headers.authorization.split(' ')[1] 
                        : null);

        if (!token) {
            return res.status(401).json({ 
                message: "Please Login!!",
                error: "No authentication token found"
            })
        }

        try {
            const decodedObj = await jwt.verify(token, "DEV@TINDER$790")
            const { _id } = decodedObj
            const user = await User.findById(_id)
            
            if (!user) {
                return res.status(401).json({ 
                    message: "Please log in again",
                    error: "User not found"
                })
            }
            
            req.user = user
            next()
        } catch (jwtError) {
            return res.status(401).json({ 
                message: "Invalid or expired token",
                error: jwtError.message
            })
        }
    } catch (err) {
        res.status(401).json({ 
            message: "Authentication failed",
            error: err.message
        })
    }
}

module.exports = {
    userAuth
}