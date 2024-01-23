const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    firstName: String
    middleName: String
    lastName: String
    birthDate: DateTime
    colorModeSetting: String
    eventSubtypes: [EventSubtype]
    events: [Event]!
  }

  type EventSubtype {
    subtype: String
    parentType: String
  }

  type Event {
    _id: ID
    user: ID
    title: String
    type: String
    subtype: String
    details: String
    eventStart: DateTime
    eventEnd: DateTime
    location: String
    links: [String]
    files: [String]
    priority: String
    setReminder: Boolean
    reminderTime: DateTime
    completed: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  type DeleteUserResponse {
    success: Boolean!
    message: String!
  }

  scalar DateTime

  type Query {
    users: [User]
    user(username: String!): User
    eventsByUser(user: ID!): [Event]
    eventsByDate(user: ID!, eventStart: DateTime): [Event]
    event(eventId: ID!): Event
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, firstName: String!, middleName: String, lastName: String): Auth
    updateUser(username: String!, email: String!, password: String, birthDate: DateTime): User
    deleteUser(username: String!): DeleteUserResponse
    login(username: String!, password: String!): Auth
    addEvent(user: ID!, title: String!, type: String, subtype: String, details: String, eventStart: DateTime, eventEnd: DateTime, location: String, links: [String], files: [String], priority: String, setReminder: Boolean, reminderTime: DateTime): Event
    removeEvent(eventId: ID!): Event
  }
`;

module.exports = typeDefs;
