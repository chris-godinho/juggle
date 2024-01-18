// Settings.js: Settings model

const { Schema, model } = require("mongoose");

const settingsSchema = new Schema({
  colorMode: {
    type: String,
    default: "default-mode-jg",
  }
});

const Settings = model("Settings", settingsSchema);

module.exports = Settings;