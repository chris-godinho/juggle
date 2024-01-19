const db = require('../config/connection');
const { User, Event } = require('../models');
const userSeeds = require('./userSeeds.json');
const eventSeeds = require('./eventSeeds.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    await cleanDB('Event', 'events');
    await cleanDB('User', 'users');

    const users = await User.create(userSeeds);

    for (let i = 0; i < eventSeeds.length; i++) {
      // Get a random user from the users array
      const randomUser = users[Math.floor(Math.random() * users.length)];

      // Create the event and associate it with the random user
      const event = await Event.create({
        ...eventSeeds[i],
        user: randomUser._id,
      });

      // Update the user's events array
      await User.findByIdAndUpdate(randomUser._id, { $addToSet: { events: event._id } });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('--------- DATABASE SEEDED ---------');
  process.exit(0);
});
