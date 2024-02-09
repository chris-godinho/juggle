// auth.js

const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRATION || '24h';

module.exports = {
  UserNotFoundError: new GraphQLError('Username not found. Please sign up to create a new account.', {
    extensions: {
      code: 'USER_NOT_FOUND',
    },
  }),
  IncorrectPasswordError: new GraphQLError('Incorrect password. Please try again.', {
    extensions: {
      code: 'INCORRECT_PASSWORD',
    },
  }),
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
