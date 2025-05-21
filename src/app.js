const express = require("express")
const app = express()
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin:"https://dev-tinder-web.onrender.com",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)










connectDB()
.then(()=>{
    console.log("Database connection established")

    app.listen(PORT,()=>{
        console.log(`server is listening on this port ${3000}`) 
     });
     
})
.catch((err)=>{
 console.log("database cannot be connected")
})
