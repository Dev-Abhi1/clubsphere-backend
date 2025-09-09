const mongoose = require("mongoose")


function connectToDB(){
    mongoose.connect(process.env.MONGO_DB_URL).then(()=>console.log("Connected to Mongo database"))
}

module.exports = connectToDB