require("dotenv").config()
const express = require("express")
const authRoute = require("./routes/auth.routes")
const clubRoute = require("./routes/club.routes")
const membershipRoute = require("./routes/membership.routes")
const eventRoute = require("./routes/event.routes")
const rsvpRoute = require("./routes/rsvp.routes")
const userRoute = require("./routes/user.routes")
const cookieparser = require("cookie-parser")
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cookieparser())
app.set("trust proxy", 1)


const allowedOrigins = (process.env.CLIENT_URLS || "https://darling-griffin-e584a3.netlify.app").split(",").map(o => o.trim())
app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true)
			const isAllowed = allowedOrigins.some((o) => origin === o || origin === `${o}/`)
			callback(isAllowed ? null : new Error("CORS not allowed"), isAllowed)
		},
		credentials: true,
	})
)
app.use("/api/auth/",authRoute)
app.use("/api/",clubRoute)
app.use("/api/memberships/",membershipRoute)
app.use("/api/event/",eventRoute)
app.use("/api",userRoute)
app.use("/api/rsvp/",rsvpRoute)

module.exports = app