const { message } = require("prompt-async");
const clubModel = require("../models/club.model");
const membershipModel = require("../models/membership.model");
const userModel = require("../models/user.model")


async function joinClubController(req, res) {
  const userId = req.user._id;
  const { clubId } = req.params;

  try {
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "Club not found!" });
    }

    const existingMembership = await membershipModel.findOne({
      userId,
      clubId,
    });
    if (existingMembership) {
      if (existingMembership.status === "active") {
        return res.status(200).json({ message: "Already a member" });
      } else if (existingMembership.status === "pending") {
        return res.status(200).json({ message: "Request already sent" });
      }
    }

    if (club.privacy === "public") {
      const membership = await membershipModel.create({
        userId,
        clubId,
        role: "member",
        status: "active",
      });
      return res.status(201).json({
        message: "Joined the club successfully",
        membership,
      });
    } else {
      const membership = await membershipModel.create({
        userId,
        clubId,
        status: "pending",
      });
      return res.status(201).json({
        message: "Join request sent and is pending approval",
        membership,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function leaveClubController(req, res) {
  try {
    const { clubId } = req.params;
    const userId = req.user._id;
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    const membership = await membershipModel.findOne({ userId, clubId });
    if (!membership) {
      return res
        .status(400)
        .json({ message: "You are not a member of this club" });
    }
    await membershipModel.deleteOne({ userId, clubId });
    return res.status(200).json({
      message: "You have successfully left the club",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function approveMemberController(req, res) {
  try {
    const { clubId, userId } = req.params;

    const targetMembership = await membershipModel.findOne({ userId, clubId });
    if (!targetMembership) {
      return res.status(404).json({ message: "Membership request not found" });
    }

    if (targetMembership.status === "active") {
      return res.status(200).json({ message: "User is already a member" });
    }

    targetMembership.status = "active";
    targetMembership.role = "member";
    await targetMembership.save();

    return res.status(200).json({
      message: `Member approved successfully by ${req.user.firstName}`,
      membership: targetMembership,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function rejectMemberController(req, res) {
  try {
    const { clubId, userId } = req.params;

    const targetMembership = await membershipModel.findOne({ userId, clubId });
    if (!targetMembership) {
      return res.status(404).json({
        message: "Member already Removed or doesn't exists",
      });
    }
    if (targetMembership.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Cannot reject an active member" });
    }

    await targetMembership.deleteOne();

    return res.status(200).json({ message: "Membership request rejected" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, Please try again later !!",
    });
  }
}

async function removeMemberController(req, res) {
  try {
    const { clubId, userId } = req.params;

    const targetMembership = await membershipModel.findOne({ userId, clubId });
    if (!targetMembership) {
      return res.status(404).json({
        message: "Member already Removed or doesn't exists",
      });
    }
    if (targetMembership.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot remove a pending member" });
    }

    await targetMembership.deleteOne();

    return res.status(200).json({ message: "Member removed from the club" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, Please try again later !!",
    });
  }
}

async function listMemberController(req, res) {
  try {
    const { clubId } = req.params;
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    const members = await membershipModel
      .find({clubId})
      .populate("userId", "firstName lastName")
      .sort({ joinedAt: -1 });
    if (!members || members.length == 0) {
      return res.status(404).json({
        message: "No member found for this club",
      });
    }

    return res.status(200).json({
      message: "Members fetched successfully",
      count : members.length,
      members,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error , please try again later",
    });
  }
}

async function listUserClubsController(req, res) {
    try {
        const {userId} = req.params
        const userExists = await userModel.findById(userId)
        if(!userExists){
            return res.status(404).json({
                message:"User Not found !"
            })
        }
        const memberships = await membershipModel.find({userId}).populate("clubId","name description privacy").sort({joinedAt:-1})

        if(memberships.length === 0){
            return res.status(404).json({
                message:"No club found for this user"
            })
        }
        return res.status(200).json({
            message:"All clubs for this user has been fetched",
            count:memberships.length,
            memberships
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message:"Internal server Error Please try again later"
        })
    }
}

module.exports = {
  joinClubController,
  leaveClubController,
  approveMemberController,
  rejectMemberController,
  removeMemberController,
  listMemberController,
  listUserClubsController,
};
