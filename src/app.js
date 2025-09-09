require("dotenv").config()
const express = require("express")
const authRoute = require("./routes/auth.routes")
const cookieparser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use("/api/auth/",authRoute)


module.exports = app