require("dotenv").config()
const express = require("express")
const authRoute = require("./routes/auth.routes")
const clubRoute = require("./routes/club.routes")
const membershipRoute = require("./routes/membership.routes")
const eventRoute = require("./routes/event.routes")
const rsvpRoute = require("./routes/rsvp.routes")
const cookieparser = require("cookie-parser")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use("/api/auth/",authRoute)
app.use("/api/",clubRoute)
app.use("/api/memberships/",membershipRoute)
app.use("/api/event/",eventRoute)
app.use("/api/rsvp/",rsvpRoute)

module.exports = app