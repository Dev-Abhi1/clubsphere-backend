const mongoose = require("mongoose")


const clubSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    privacy:{
        type:String,
        enum:["public","private"],
        required:true,
    },
    tags:[{
        type:String,
        required:true
    },]

},{timestamps:true})

const club = new mongoose.model("club",clubSchema)


module.exports = club