const {schema, model, Schema}= require("mongoose");

const networkSchema = new Schema({
    coinId:{
        type:Object,
        required:true
    },
    coinSymbol:{
        type:String,
        default:"my coin"
    },
    coinNetworks:{
        type:Array,
        default:[]
    },
})


module.exports = model("networkDetails",networkSchema)