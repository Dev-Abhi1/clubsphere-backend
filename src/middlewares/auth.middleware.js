const jwt = require("jsonwebtoken");
const { message } = require("prompt-async");
const userModel = require("../models/user.model");
async function authMiddleWare(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found or deleted" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = authMiddleWare;
