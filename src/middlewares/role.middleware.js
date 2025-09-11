
const membershipModel = require("../models/membership.model");

function checkRole(roles) {
  return async (req, res, next) => {
    try {
      const {clubId }= req.params;
      const userId = req.user._id;

      const membership = await membershipModel.findOne({clubId, userId,status:"active"});
      if (!membership || !roles.includes(membership.role)) {
        return res.status(403).json({
          message:
            "Either membership not found or role is insufficient for this operation",
        });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
}


module.exports = checkRole