const { User, Event } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const { DateTimeResolver } = require("graphql-scalars");

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
    eventsByDate: async (parent, { user, eventStart }) => {
      console.log(
        "[resolvers.js] eventsByDate: user =",
        user,
        "eventStart =",
        eventStart
      );

      let params = { user };

      // If eventStart is provided, filter by the date component
      if (eventStart) {
        const startDate = new Date(eventStart);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Move to the next day

        params.eventStart = { $gte: startDate, $lt: endDate };
      }

      const result = await Event.find(params).sort({ eventStart: 1 });
      console.log("[resolvers.js] eventsByDate: result =", result);
      return result;
    },
    event: async (parent, { eventId }) => {
      return Event.findOne({ _id: eventId });
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
      console.log(
        "[resolvers.js] updateUser: email =",
        email,
        "password =",
        password,
        "birthDate =",
        birthDate
      );
    
      // Create an object to store the fields with values
      const updateFields = {};
    
      // Add non-empty and defined fields to the updateFields object
      if (email !== "") updateFields.email = email;
      if (password !== "") updateFields.password = password;
      if (birthDate !== "") updateFields.birthDate = birthDate;
    
      console.log("[resolvers.js] updateUser: updateFields =", updateFields);
    
      // Use the $set operator to update only the specified fields
      const user = await User.findOneAndUpdate(
        { username },
        { $set: updateFields },
        { new: true }
      );
    
      console.log("[resolvers.js] updateUser: user =", user);
      return { user };
    },
    deleteUser: async (parent, { username }) => {
      console.log("[resolvers.js] deleteUser: username =", username);

      try {
        // Find and remove the user
        const deletedUser = await User.findOneAndDelete({ username });

        console.log("[resolvers.js] deleteUser: user deleted =", deletedUser);
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
        setReminder,
        reminderTime,
      }
    ) => {
      console.log(
        "[resolvers.js] addEvent: user =",
        user,
        "title =",
        title,
        "type =",
        type,
        "subtype =",
        subtype,
        "details =",
        details,
        "eventStart =",
        eventStart,
        "eventEnd =",
        eventEnd,
        "location =",
        location,
        "links =",
        links,
        "files =",
        files,
        "priority =",
        priority,
        "setReminder =",
        setReminder,
        "reminderTime =",
        reminderTime
      );
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
        setReminder,
        reminderTime,
      });

      await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { events: event._id } }
      );

      console.log("[resolvers.js] addEvent: event =", event);

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
        setReminder,
        reminderTime,
        completed,
      }
    ) => {
      console.log(
        "[resolvers.js] updateEvent: eventId =",
        eventId,
        "title =",
        title,
        "type =",
        type,
        "subtype =",
        subtype,
        "details =",
        details,
        "eventStart =",
        eventStart,
        "eventEnd =",
        eventEnd,
        "location =",
        location,
        "links =",
        links,
        "files =",
        files,
        "priority =",
        priority,
        "setReminder =",
        setReminder,
        "reminderTime =",
        reminderTime,
        "completed =",
        completed
      );

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
          setReminder,
          reminderTime,
          completed,
        },
        { new: true }
      );

      console.log("[resolvers.js] updateEvent: event =", event);

      return event;
    },
    removeEvent: async (parent, { eventId }) => {
      return Event.findOneAndDelete({ _id: eventId });
    },
  },
};

module.exports = resolvers;
