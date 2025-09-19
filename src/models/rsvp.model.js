const mongoose = require("mongoose")


const rsvpSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"event",
        required:true,
    },
    status:{
        type:String,
        enum:["going","interested","not going"],
        default:"going"
    }
},{timestamps:true}) 


const rsvpModel = new mongoose.model("rsvp",rsvpSchema)

module.exports = rsvpModel