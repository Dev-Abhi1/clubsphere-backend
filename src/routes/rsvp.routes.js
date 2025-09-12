const express = require("express")
const authMiddleWare = require("../middlewares/auth.middleware")
const checkRole = require("../middlewares/role.middleware")
const { rsvpEventController, rsvpEventStatusController, rsvpEventDeleteController, rsvpEventAttendeesController } = require("../controllers/rsvp.controller")
const router = express.Router()



router.post("/clubs/:clubId/events/:eventId/rsvp",authMiddleWare,checkRole(["owner","admin","member"]),rsvpEventController)
router.patch("/clubs/:clubId/events/:eventId/rsvp-update",authMiddleWare,checkRole(["owner","admin","member"]),rsvpEventStatusController)
router.delete("/clubs/:clubId/events/:eventId/rsvp-delete",authMiddleWare,checkRole(["owner","admin","member"]),rsvpEventDeleteController)
router.get("/clubs/:clubId/events/:eventId/attendees",authMiddleWare,checkRole(["owner","admin","member"]),rsvpEventAttendeesController)




module.exports=router