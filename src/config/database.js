// used_id: sahu5chetan5
// password: devTinder
const mongoose = require('mongoose')


const connectDB =async()=>{
    await mongoose.connect ("mongodb+srv://sahu5chetan5:devTinder@cluster0.awlad.mongodb.net/devTinder")
}

  
  module.exports = connectDB;