const express = require("express")
const authMiddleWare = require("../middlewares/auth.middleware")
const { createClubController, getAllClubController, updateClubController, deleteClubController, getClubController } = require("../controllers/club.controller")
const router = express.Router()

// Public routes
router.get("/clubs",getAllClubController)
router.get("/clubs/:id",getClubController)


//Protected Routes
router.post("/clubs",authMiddleWare,createClubController)
router.patch("/clubs/:id",authMiddleWare,updateClubController)
router.delete("/clubs/:id",authMiddleWare,deleteClubController)


module.exports = router