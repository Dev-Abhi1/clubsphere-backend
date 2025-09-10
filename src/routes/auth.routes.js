const express = require("express")
const { registerUserController, loginUserController, logoutUserController } = require("../controllers/auth.controller")

const router = express.Router()



router.post("/login",loginUserController)
router.post("/register",registerUserController)
router.post("/logout", logoutUserController)



module.exports = router