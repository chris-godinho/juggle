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
    enum: ["life", "work", "unspecified"],
  },
  subtype: {
    type: String,
  },
  details: {
    type: String,
  },
  eventStart: {
    type: Date,
  },
  eventEnd: {
    type: Date,
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
  priority: {
    type: String,
    enum: ["Low", "Normal", "High"],
    default: "Normal",
  },
  isAllDay: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  taskListOrder: {
    type: Number,
    default: null,
  },
});

const Event = model("Event", eventSchema);

module.exports = Event;