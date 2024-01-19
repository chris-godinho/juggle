const { User, Event } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('events');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('events');
    },
    events: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Event.find(params).sort({ startTime: 1 });
    },
    event: async (parent, { eventId }) => {
      return Event.findOne({ _id: eventId });
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password, firstName, middleName, lastName }) => {
      const user = await User.create({ username, email, password, firstName, middleName, lastName });
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
    addEvent: async (parent, { user, title, type, subtype, details, startDate, startTime, endDate, endTime, location, links, files }) => {
      const event = await Event.create({ user, title, type, subtype, details, startDate, startTime, endDate, endTime, location, links, files });

      await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { events: event._id } }
      );

      return event;
    },
    removeEvent: async (parent, { eventId }) => {
      return Event.findOneAndDelete({ _id: eventId });
    }
  },
};

module.exports = resolvers;
