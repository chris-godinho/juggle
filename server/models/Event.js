// Event.js: Event model

const { Schema, model } = require("mongoose");

const eventSchema = new Schema({
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
  date: {
    type: Date,
  },
  time: {
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