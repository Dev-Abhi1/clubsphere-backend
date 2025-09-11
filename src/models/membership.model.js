const mongoose = require("mongoose")


const memberShipSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
        index:true
    },
    clubId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"club",
        required:true,
        index:true
    },
    role:{
        type:String,
        enum:["owner","admin","member"],
        default:"member",
        required:true
    },
    status:{
        type:String,
        enum:["active","pending","banned"],
        default:"pending",
        required:true
    },
    joinedAt:{
        type:Date,
        default:Date.now
        
    },
    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
});

// indexes for better query perfomance and avoid duplicacy
memberShipSchema.index({ userId: 1, clubId: 1 }, { unique: true });

const memberShipModel = new mongoose.model("membership",memberShipSchema)

module.exports = memberShipModel