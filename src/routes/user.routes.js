const express = require("express")
const authMiddleWare = require("../middlewares/auth.middleware")
const {getUserController, updateUserController, deleteUserController, findUserController} = require("../controllers/user.controller")
const router = express.Router()

router.get("/users/me",authMiddleWare,getUserController)
router.patch("/users/me",authMiddleWare,updateUserController)
router.delete("/users/me",authMiddleWare,deleteUserController)
router.get("/users/:id",findUserController)



module.exports = router