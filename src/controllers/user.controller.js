const userModel = require("../models/user.model");
const memberShipModel = require("../models/membership.model");
const rsvpModel = require("../models/rsvp.model");
const clubModel = require("../models/club.model")
const eventModel = require("../models/event.model")

const bcrypt = require("bcryptjs");

async function getUserController(req, res) {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const membership = await memberShipModel
      .find({ userId })
      .populate("clubId", "title");
    const rsvp = await rsvpModel
      .find({ userId, status: "going" })
      .populate("eventId", "title startTime location");
    return res.status(200).json({
      message: "User details fetched successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      },
      clubs: membership.map((m) => ({
        clubId: m.clubId._id,
        title: m.clubId.title,
        role: m.role,
        status: m.status,
      })),
      rsvp: rsvp.map((m) => ({
        eventId: m.eventId._id,
        title: m.eventId.title,
        startTime: m.eventId.startTime,
        location: m.eventId.location,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUserController(req, res) {
  try {
    const { firstName, lastName, userName, oldPassword, newPassword } =
      req.body;
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (userName && userName !== user.userName) {
      const existingUserName = await userModel.findOne({ userName });
      if (existingUserName) {
        return res.status(400).json({
          message: "username already exist , please try again",
        });
      }
      user.userName = userName;
    }

    if (oldPassword && newPassword) {
      const oldPassVerify = await bcrypt.compare(oldPassword, user.password);
      if (!oldPassVerify) {
        return res.status(400).json({
          message: "Old password is not matching, please try again",
        });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    } else {
      return res.status(404).json({
        message: "Please enter the password",
      });
    }
    await user.save();
    return res.status(200).json({
      message: "User profile updated successfully",
      user:{
         firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, please try again later",
    });
  }
}

async function deleteUserController(req, res) {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await memberShipModel.deleteMany({ userId });
    await rsvpModel.deleteMany({ userId });
    await clubModel.deleteMany({ createdBy: userId });
    await eventModel.deleteMany({ createdBy: userId });
    await user.deleteOne();
    res.clearCookie("token");
    return res.status(200).json({
      message: "User account and related data deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error,please try again later",
    });
  }
}

async function findUserController(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const userMemberShips = await memberShipModel
      .find({ userId: id })
      .populate("clubId", "title");

    return res.status(200).json({
      message: "User details fetched Successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      },
      memberships: userMemberShips.map((m) => ({
        clubId: m.clubId._id,
        title: m.clubId.title,
        role: m.role,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getUserController,
  updateUserController,
  deleteUserController,
  findUserController,
};
