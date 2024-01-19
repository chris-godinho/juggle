// User.js: User model

const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: [/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/, 'Must contain at least one letter, one number, and one special character.'],
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  colorModeSetting: {
    type: String,
    default: "default-mode-jg",
  },
  eventSubtypes: {
    type: [
      {
        subtype: String,
        category: {
          type: String,
          enum: ['life', 'work'],
        },
      },
    ],
    default: [
      { subtype: 'Family', category: 'life' },
      { subtype: 'Health', category: 'life' },
      { subtype: 'Fitness', category: 'life' },
      { subtype: 'Financial', category: 'life' },
      { subtype: 'Leisure', category: 'life' },
      { subtype: 'Shift', category: 'work' },
      { subtype: 'Meeting', category: 'work' },
      { subtype: 'Project', category: 'work' },
      { subtype: 'Networking', category: 'work' },
      { subtype: 'Education', category: 'work' },
    ],
  },
  events: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;
