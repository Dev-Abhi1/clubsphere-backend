const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      required: true,
      enum: ["public", "members"],
    },
    capacity: {
      type: Number,
      default: null,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const eventModel = new mongoose.model("event", eventSchema);

module.exports = eventModel;
