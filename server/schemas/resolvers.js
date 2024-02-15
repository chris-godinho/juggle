const { User, Event } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { DateTimeResolver } = require("graphql-scalars");
const { generatePresignedUrl, deleteFile } = require("../utils/awsS3.js");

const resolvers = {
  DateTime: DateTimeResolver,
  Query: {
    users: async () => {
      return User.find().populate("events");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("events");
    },
    eventsByUser: async (parent, { user }) => {
      const params = user ? { user } : {};
      return Event.find(params).sort({ eventStart: 1 });
    },
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
      /*
      console.log(
        "-----------------------------------------------------------------"
      );
      console.log("[resolvers.js] eventsByDate: result =", result);
      */
      return result;
    },
    event: async (parent, { eventId }) => {
      return Event.findOne({ _id: eventId });
    },
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
      console.log(
        "-----------------------------------------------------------------"
      );
      console.log(
        "[resolvers.js] updateUserSettings: username =",
        username,
        "colorModeSetting =",
        colorModeSetting,
        "eventSubtypes =",
        eventSubtypes,
        "statSettings =",
        statSettings,
        "sleepingHours =",
        sleepingHours,
        "lifePreferredActivities =",
        lifePreferredActivities,
        "workPreferredActivities =",
        workPreferredActivities,
        "eventSettings =",
        eventSettings,
        "layoutSettings =",
        layoutSettings,
        "localizationSettings =",
        localizationSettings
      );

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

      console.log(
        "-----------------------------------------------------------------"
      );
      console.log(
        "[resolvers.js] updateUserSettings: updateFields =",
        updateFields
      );

      // Use the $set operator to update only the specified fields
      const user = await User.findOneAndUpdate(
        { username },
        { $set: updateFields },
        { new: true }
      );

      console.log(
        "-----------------------------------------------------------------"
      );
      console.log("[resolvers.js] updateUserSettings: user =", user);
      return { user };
    },
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
    removeEvent: async (parent, { eventId }) => {
      return Event.findOneAndDelete({ _id: eventId });
    },
    deleteFile: async (__, { username, fileName }) => {
      return deleteFile(username, fileName);
    },
  },
};

module.exports = resolvers;
