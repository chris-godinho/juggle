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
  birthDate: {
    type: Date,
  },
  colorModeSetting: {
    type: String,
    default: "default-mode-jg",
  },
  eventSubtypes: {
    type: [
      {
        subtype: String,
        parentType: {
          type: String,
          enum: ['life', 'work'],
        },
      },
    ],
    unique: true,
    default: [
      { subtype: 'Family', parentType: 'life' },
      { subtype: 'Health', parentType: 'life' },
      { subtype: 'Fitness', parentType: 'life' },
      { subtype: 'Financial', parentType: 'life' },
      { subtype: 'Leisure', parentType: 'life' },
      { subtype: 'Shift', parentType: 'work' },
      { subtype: 'Meeting', parentType: 'work' },
      { subtype: 'Project', parentType: 'work' },
      { subtype: 'Networking', parentType: 'work' },
      { subtype: 'Education', parentType: 'work' },
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
