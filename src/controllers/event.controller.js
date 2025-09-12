const { message } = require("prompt-async");
const clubModel = require("../models/club.model");
const eventModel = require("../models/event.model");

async function createEventController(req, res) {
  try {
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      visibility,
      capacity,
    } = req.body;
    if (
      !title ||
      !description ||
      !startTime ||
      !endTime ||
      !location ||
      !visibility
    ) {
      return res.status(400).json({
        message: "Please fill the required details for the event",
      });
    }
    const { clubId } = req.params;
    const userId = req.user._id;

    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        message: "Please select any future date",
      });
    }

    const event = await eventModel.create({
      title,
      description,
      clubId,
      createdBy: userId,
      startTime,
      endTime,
      location,
      visibility,
      capacity,
      attendees: [],
    });

    return res.status(201).json({
      message: "New event is created",
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error,please try again later",
    });
  }
}

async function getEventController(req, res) {
  try {
    const { clubId } = req.params;
    const club = await clubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found !",
      });
    }
    const events = await eventModel
      .find({ clubId })
      .sort({ startTime: 1 })
      .populate("createdBy", "userName email")
      .populate("clubId", "name");
    if (!events || events.length === 0) {
      return res.status(200).json({
        message: "No event found for this club",
        events: [],
      });
    }
    return res.status(200).json({
      message: "All events fetch for this club",
      events,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error, please try again later",
    });
  }
}

async function singleEventController(req, res) {
  try {
    const { eventId } = req.params;
    const event = await eventModel
      .findById(eventId)
      .populate("clubId", "title description")
      .populate("createdBy", "userName email");
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
    return res.status(200).json({
      message: "Event details fetched",
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error,please try again later",
    });
  }
}

async function updateEventController(req, res) {
  try {
    const { clubId, eventId } = req.params;
    const club = await clubModel.findById(clubId);
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      visibility,
      capacity,
    } = req.body;
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
    if(new Date(endTime) <= new Date(startTime)){
        return res.status(400).json({
            message:"Select any date from future"
        })
    }
    if (title) event.title = title;
    if (description) event.description = description;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (location) event.location = location;
    if (visibility) event.visibility = visibility;
    if (capacity) event.capacity = capacity;
    await event.save();

    return res.status(200).json({
      message: "Event details updated successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server Error , please try again later",
    });
  }
}

async function deleteEventController(req, res) {
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
    await event.deleteOne();
    return res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error, please try again later",
    });
  }
}

module.exports = {
  createEventController,
  getEventController,
  singleEventController,
  updateEventController,
  deleteEventController,
};
