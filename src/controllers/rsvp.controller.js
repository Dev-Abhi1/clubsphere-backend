
const clubModel = require("../models/club.model");
const rsvpModel = require("../models/rsvp.model");
const eventModel = require("../models/event.model");

async function rsvpEventController(req, res) {
  try {
    const { clubId, eventId } = req.params;
    const userId = req.user._id;
    const { status } = req.body;

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    const existingRSVP = await rsvpModel.findOne({userId,eventId})
    if (existingRSVP) {
  existingRSVP.status = status;
  await existingRSVP.save();
  return res.status(200).json({ message: "RSVP updated", rsvp: existingRSVP });
}

    const rsvp = await rsvpModel.create({
      userId,
      eventId,
      status,
    });

    return res.status(200).json({
      message: "Rsvp done",
      rsvp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, Please try again later",
    });
  }
}

async function rsvpEventStatusController(req,res) {
   try {
    const { clubId, eventId } = req.params;
    const userId = req.user._id
    const { status } = req.body;

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    if(status){
      await rsvpModel.findOneAndUpdate({userId,eventId},{status},{new:true})

    }
     return res.status(200).json({
      message: "Event Status updated",
      
    });
   } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, Please try again later",
    });
   }
}

async function rsvpEventDeleteController(req,res) {
       try {
    const { clubId, eventId } = req.params;
    const userId = req.user._id
    

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    const rsvp = await rsvpModel.findOne({userId,eventId})
    if(!rsvp){
        return res.status(404).json({
            message:"rsvp for this event not found"
        })
    }
    await rsvp.deleteOne()
     return res.status(200).json({
      message: "Rsvp for this event is deleted",
      
    });
   } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, Please try again later",
    });
   }
}

async function rsvpEventAttendeesController(req,res) {
   try {
    const { clubId, eventId } = req.params;
    
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    const attendees = await rsvpModel
      .find({ eventId, status: "going" })
      .populate("userId", "firstName lastName email userName")
     return res.status(200).json({
      message: " All attendees for this event has been fetched !!",
      attendees
      
    });
   } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, Please try again later",
    });
   }
}

module.exports = { rsvpEventController, rsvpEventStatusController,rsvpEventDeleteController, rsvpEventAttendeesController };
