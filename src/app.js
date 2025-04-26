const express = require("express")
const app = express()
const connectDB = require("./config/database")
const cookieParser = require("cookie-parser")


app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")


app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)









connectDB()
.then(()=>{
    console.log("Database connection established")

    app.listen(3000,()=>{
        console.log(`server is listening on this port ${3000}`) 
     });
     
})
.catch((err)=>{
 console.log("database cannot be connected")
})
