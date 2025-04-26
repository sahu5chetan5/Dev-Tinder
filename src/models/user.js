const mongoose = require('mongoose')
const { isLowercase } = require('validator')
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Invalid email address:" + value)
            }
        }
    },
    password:{
        type: String,
        required:true,
        validate(value){
            if (!validator.isStrongPassword(value)){
                throw new Error ("Enter a strong password: "+value)
            }}
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        validate(value){
            if (!["male","female","others"].includes(value)){
                throw new Error ("Gender data is not valid")
            }
        },
    },
    photoUrl:{
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(value){
            if (!validator.isURL(value)){
                throw new Error ("Invalid email address: "+value)
            }
        }
    },
    about:{
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String],

    }
})

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id}, "DEV@TINDER$790",{expiresIn: "1d"})
    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password
    const isPasswordValid =  await bcrypt.compare(passwordInputByUser,passwordHash)
    return isPasswordValid
}

module.exports =  mongoose.model("User", userSchema)