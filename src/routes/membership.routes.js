const express = require("express")
const authMiddleWare = require("../middlewares/auth.middleware")
const { joinClubController,leaveClubController, approveMemberController, rejectMemberController,removeMemberController,listMemberController, listUserClubsController } = require("../controllers/membership.controller")
const checkRole = require("../middlewares/role.middleware")
const router = express.Router()


router.post("/clubs/:clubId/join",authMiddleWare,joinClubController)
router.delete("/clubs/:clubId/leave",authMiddleWare,leaveClubController)
router.patch("/clubs/:clubId/approve/:userId",authMiddleWare,checkRole(["owner","admin"]),approveMemberController)
router.patch("/clubs/:clubId/reject/:userId",authMiddleWare,checkRole(["owner","admin"]),rejectMemberController)
router.delete("/clubs/:clubId/remove/:userId",authMiddleWare,checkRole(["owner","admin"]),removeMemberController)
router.get("/clubs/:clubId/members",authMiddleWare,checkRole(["owner","admin","member"]),listMemberController)
router.get("/users/:userId/clubs",listUserClubsController)




module.exports = router