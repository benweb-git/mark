const mongoose = require("mongoose");

module.exports.dbConnect = async()=>{
     
    try{
        await mongoose.connect(process.env.DB_URL,{useNewURLParser:true})
        console.log("database connected")
    }catch(error){
        console.log("an error occured while trying to connect: "+error)

    }

}