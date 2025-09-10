require("dotenv").config()
const express = require("express")
const authRoute = require("./routes/auth.routes")
const clubRoute = require("./routes/club.routes")
const cookieparser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use("/api/auth/",authRoute)
app.use("/api/",clubRoute)

module.exports = app