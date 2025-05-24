const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: "Please Login!!" })
        }

        try {
            const decodedObj = await jwt.verify(token, "DEV@TINDER$790")
            const { _id } = decodedObj
            const user = await User.findById(_id)
            
            if (!user) {
                return res.status(401).json({ message: "Please log in again" })
            }
            
            req.user = user
            next()
        } catch (jwtError) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
    } catch (err) {
        res.status(401).json({ message: "Authentication failed" })
    }
}

module.exports = {
    userAuth
}