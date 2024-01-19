const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    firstName: String
    middleName: String
    lastName: String
    colorModeSetting: String
    events: [Event]!
  }

  type Event {
    _id: ID
    user: ID
    title: String
    type: String
    subtype: String
    details: String
    startDate: String
    startTime: String
    endDate: String
    endTime: String
    location: String
    links: [String]
    files: [String]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    events(username: String): [Event]
    event(eventtId: ID!): Event
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, firstName: String!, middleName: String, lastName: String): Auth
    login(username: String!, password: String!): Auth
    addEvent(user: ID!, title: String!, type: String, subtype: String, details: String, startDate: String, startTime: String, endDate: String, endTime: String, location: String, links: [String], files: [String]): Event
    removeEvent(eventId: ID!): Event
  }
`;

module.exports = typeDefs;
