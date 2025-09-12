const express = require("express")
const authmiddleware = require("../middlewares/auth.middleware")
const checkRole = require("../middlewares/role.middleware")
const { createEventController, getEventController, singleEventController, updateEventController, deleteEventController } = require("../controllers/event.controller")
const router = express.Router()


router.post("/clubs/:clubId/createEvent",authmiddleware,checkRole(["owner","admin"]),createEventController)
router.get("/clubs/:clubId/getEvents",authmiddleware,checkRole(["owner","admin","member"]),getEventController)
router.get("/clubs/:clubId/events/:eventId",authmiddleware,checkRole(["owner","admin","member"]),singleEventController)
router.patch("/clubs/:clubId/events/:eventId",authmiddleware,checkRole(["owner"]),updateEventController)
router.delete("/clubs/:clubId/events/:eventId",authmiddleware,checkRole(["owner"]),deleteEventController)





module.exports = router