// Event.js: Event model

const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["life", "work"],
  },
  subtype: {
    type: String,
  },
  details: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  endDate: {
    type: Date,
  },
  endTime: {
    type: String,
  },
  location: {
    type: String,
  },
  links: {
    type: [String],
  },
  files: {
    type: [String],
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;