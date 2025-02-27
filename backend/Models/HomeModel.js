const {schema, model, Schema}= require("mongoose");

const homeSchema = new Schema({
    celebName:{
        type:String,
        required:true
    },
    celebImagePublicId:{
        type:String,
        required:true
    },
    celebImage:{
        type:String,
        required:true
    },
    celebVideo:{
        type:String,
        required:true
    },
    celebVideoPublicId:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        default:"https://images.app.goo.gl/br1nU8NTnCCoqzDv7"
    },
})


module.exports = model("homeDetails",homeSchema)