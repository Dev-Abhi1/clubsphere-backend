
const clubModel = require("../models/club.model");
const memberShipModel = require("../models/membership.model");

async function createClubController(req, res) {
  try {
    const { title, description, privacy, tags } = req.body;
    if (!title || !description || !privacy) {
      return res.status(400).json({
        message: "Please fill the required details",
      });
    }
    const userId = req.user._id;
    const tagsArray = Array.isArray(tags)
      ? tags
      : tags
      ? tags.split(",").map((tag) => tag.trim())
      : [];
    const club = await clubModel.create({
      title,
      description,
      createdBy: userId,
      privacy:privacy.toLowerCase(),
      tags: tagsArray,
    });
     await memberShipModel.create({
       userId:userId,
       clubId:club._id,
       role:"owner",
       status:"active"
    })
    return res.status(201).json({
      message: "New Club created Successfully !!",
      club,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server error , Please try again later",
    });
  }
}

async function getAllClubController(req, res) {
  try {
    const clubs = await clubModel
      .find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    if (!clubs || clubs.length === 0) {
      return res.status(200).json({
        message: "No club found",
        clubs: [],
      });
    }

    return res.status(200).json({
      message: "Club fetched successfully",
      total: clubs.length,
      clubs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error , please try again later",
    });
  }
}

async function getClubController(req,res) {
    try {
        const {id} = req.params
        const club = await clubModel.findById(id).populate("createdBy","userName email")
        if(!club){
            return res.status(404).json({
                message:"Club not found"
            })
        }
        return res.status(200).json({
            message:"Club detail fetch successfully",
            club
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message:"Internal Server Error. Please try again later"
        })
    }
}

async function updateClubController(req, res) {
  try {
    const { id } = req.params;
    const { title, description, privacy, tags } = req.body;
    const tagsArray = Array.isArray(tags)
      ? tags
      : tags
      ? tags.split(",").map((tag) => tag.trim())
      : undefined;

    //finding club
    const club = await clubModel.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    //checking club ownership
    if(club.createdBy.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message:"You are not allowed to update this club info"
        })
    }
    if(title) club.title = title
    if(description) club.description = description;
    if(privacy) club.privacy = privacy
    if(tags) club.tags = tagsArray

    await club.save()
    return res.status(200).json({
      message: "Club info updated",
      club,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server Error. Please try again later",
    });
  }
}

async function deleteClubController(req,res) {
  try {
    const {id} = req.params
    const userId = req.user._id
    const club = await clubModel.findById(id)
    if(!club){
        return res.status(404).json({
            message:"No club found"
        })
    }
    if(club.createdBy.toString() !== userId.toString()){
        return res.status(403).json({message:"You have no permission to delete this club"})
    }
    await club.deleteOne()
    return res.status(200).json({
        message:"club deleted successfully"
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
        message:"Internal Server Error, please try again later"
    })
  }
}

module.exports = { createClubController, getAllClubController, getClubController, updateClubController, deleteClubController };
