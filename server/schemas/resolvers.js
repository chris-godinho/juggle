// resolvers.js
// Resolvers for the GraphQL API

const { User, Event } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { DateTimeResolver } = require("graphql-scalars");
const { generatePresignedUrl, deleteFile } = require("../utils/awsS3.js");

const resolvers = {
  // Custom scalar type for DateTime
  DateTime: DateTimeResolver,
  Query: {
    // Get all users
    users: async () => {
      return User.find().populate("events");
    },
    // Get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("events");
    },
    // Get all events by user
    eventsByUser: async (parent, { user }) => {
      const params = user ? { user } : {};
      return Event.find(params).sort({ eventStart: 1 });
    },
    // Get all events by date
    eventsByDate: async (
      parent,
      { user, selectedDateStart, selectedDateEnd }
    ) => {
      let params = { user };

      params.$or = [
        {
          $or: [
            { eventStart: { $lt: selectedDateEnd, $gte: selectedDateStart } },
            { eventEnd: { $lte: selectedDateEnd, $gt: selectedDateStart } },
          ],
        },
        {
          $and: [
            { eventStart: { $lte: selectedDateStart } },
            { eventEnd: { $gte: selectedDateEnd } },
          ],
        },
      ];

      const result = await Event.find(params).sort({ eventStart: 1 });
      return result;
    },
    // Get an event by ID
    event: async (parent, { eventId }) => {
      return Event.findOne({ _id: eventId });
    },
    // Get a pre-signed URL for profile picture
    generatePresignedUrl: async (_, { username, fileName }) => {
      try {
        const url = await generatePresignedUrl(username, fileName);
        return url;
      } catch (error) {
        console.error("Error generating pre-signed URL:", error);
        throw new Error("Error generating pre-signed URL");
      }
    },
  },

  Mutation: {
    // Add a new user
    addUser: async (
      parent,
      { username, email, password, firstName, middleName, lastName }
    ) => {
      const user = await User.create({
        username,
        email,
        password,
        firstName,
        middleName,
        lastName,
      });
      const token = signToken(user);
      return { token, user };
    },
    // Log in a user to the application
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    // Update user data
    updateUser: async (parent, { username, email, password, birthDate }) => {
      // Create an object to store the fields with values
      const updateFields = {};

      // Add non-empty and defined fields to the updateFields object
      if (email !== "") updateFields.email = email;
      if (password !== "") updateFields.password = password;
      if (birthDate !== "") updateFields.birthDate = birthDate;

      // Use the $set operator to update only the specified fields
      const user = await User.findOneAndUpdate(
        { username },
        { $set: updateFields },
        { new: true }
      );

      return { user };
    },
    // Update user settings
    updateUserSettings: async (
      parent,
      {
        username,
        colorModeSetting,
        eventSubtypes,
        statSettings,
        sleepingHours,
        lifePreferredActivities,
        workPreferredActivities,
        eventSettings,
        layoutSettings,
        localizationSettings,
      }
    ) => {
      // Create an object to store the fields with values
      const updateFields = {};

      // Add non-empty and defined fields to the updateFields object
      if (colorModeSetting) updateFields.colorModeSetting = colorModeSetting;
      if (eventSubtypes) updateFields.eventSubtypes = eventSubtypes;
      if (statSettings) updateFields.statSettings = statSettings;
      if (sleepingHours) updateFields.sleepingHours = sleepingHours;
      if (lifePreferredActivities)
        updateFields.lifePreferredActivities = lifePreferredActivities;
      if (workPreferredActivities)
        updateFields.workPreferredActivities = workPreferredActivities;
      if (eventSettings) updateFields.eventSettings = eventSettings;
      if (layoutSettings) updateFields.layoutSettings = layoutSettings;
      if (localizationSettings)
        updateFields.localizationSettings = localizationSettings;

      // Use the $set operator to update only the specified fields
      const user = await User.findOneAndUpdate(
        { username },
        { $set: updateFields },
        { new: true }
      );

      return { user };
    },
    // Delete a user from the database
    deleteUser: async (parent, { username }) => {

      try {
        // Find and remove the user
        const deletedUser = await User.findOneAndDelete({ username });

        return { success: true, message: "User deleted successfully." };
      } catch (error) {
        console.error("[resolvers.js] deleteUser error:", error);
        return { success: false, message: "Error deleting user." };
      }
    },
    // Add a new event
    addEvent: async (
      parent,
      {
        user,
        title,
        type,
        subtype,
        details,
        eventStart,
        eventEnd,
        location,
        links,
        files,
        priority,
        isAllDay,
        reminderTime,
      }
    ) => {

      const event = await Event.create({
        user,
        title,
        type,
        subtype,
        details,
        eventStart,
        eventEnd,
        location,
        links,
        files,
        priority,
        isAllDay,
        reminderTime,
      });

      await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { events: event._id } }
      );

      return event;
    },
    // Update an event
    updateEvent: async (
      parent,
      {
        eventId,
        title,
        type,
        subtype,
        details,
        eventStart,
        eventEnd,
        location,
        links,
        files,
        priority,
        isAllDay,
        reminderTime,
        completed,
        taskListOrder,
      }
    ) => {
      const event = await Event.findOneAndUpdate(
        { _id: eventId },
        {
          title,
          type,
          subtype,
          details,
          eventStart,
          eventEnd,
          location,
          links,
          files,
          priority,
          isAllDay,
          reminderTime,
          completed,
          taskListOrder,
        },
        { new: true }
      );

      return event;
    },
    // Delete an event
    removeEvent: async (parent, { eventId }) => {
      return Event.findOneAndDelete({ _id: eventId });
    },
    // Delete user's profile picture
    deleteFile: async (__, { username, fileName }) => {
      return deleteFile(username, fileName);
    },
  },
};

module.exports = resolvers;
