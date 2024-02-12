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
    statSettings: StatSettingMatrix
    sleepingHours: SleepingHoursMatrix
    lifePreferredActivities: LifePreferredActivitiesMatrix
    workPreferredActivities: WorkPreferredActivitiesMatrix
    eventSettings: EventSettingMatrix
    layoutSettings: LayoutSettingMatrix
    localizationSettings: LocalizationSettingMatrix
    events: [Event]!
  }

  type EventSubtype {
    subtype: String
    parentType: String
  }

  type StatSettingMatrix {
    showStats: Boolean
    balanceGoal: Int
    percentageBasis: String
    ignoreUnalotted: Boolean
  }

  type SleepingHoursMatrix {
    sunday: SleepingHoursDay
    monday: SleepingHoursDay
    tuesday: SleepingHoursDay
    wednesday: SleepingHoursDay
    thursday: SleepingHoursDay
    friday: SleepingHoursDay
    saturday: SleepingHoursDay
  }

  type SleepingHoursDay {
    start: String
    end: String
  }

  type LifePreferredActivitiesMatrix {
    exercise: Boolean
    mindfulness: Boolean
    sleep: Boolean
    healthAwareness: Boolean
    reading: Boolean
    music: Boolean
    games: Boolean
    movies: Boolean
    cooking: Boolean
    socializing: Boolean
    sports: Boolean
    outdoorsExploration: Boolean
    travel: Boolean
    journaling: Boolean
    personalGrowth: Boolean
    creativeExpression: Boolean
    financialPlanning: Boolean
    digitalDetox: Boolean
    purposeAndMeaning: Boolean
    boundarySetting: Boolean
  }

  type WorkPreferredActivitiesMatrix {
    goalSetting: Boolean
    skillDevelopment: Boolean
    industryResearch: Boolean
    mentorship: Boolean
    softSkills: Boolean
    networking: Boolean
    branding: Boolean
    progressEvaluation: Boolean
    teamBuilding: Boolean
    teamFeedback: Boolean
    customerFeedback: Boolean
    qualityAssurance: Boolean
    brainstorming: Boolean
    innovationMindset: Boolean
    technologyIntegration: Boolean
    teamIntegration: Boolean
    milestoneCelebration: Boolean
    reverseMentorship: Boolean
    volunteering: Boolean
    entrepreneurship: Boolean
  }

  type EventSettingMatrix {
    completeAfterEnd: Boolean
  }

  type LayoutSettingMatrix {
    dashboardLayout: String
    viewStyle: String
  }

  type LocalizationSettingMatrix {
    timeZone: Int
    dateFormat: String
    timeFormat: String
  }

  input EventSubtypeInput {
    subtype: String
    parentType: String
  }
  
  input StatSettingMatrixInput {
    showStats: Boolean
    balanceGoal: Int
    percentageBasis: String
    ignoreUnalotted: Boolean
  }
  
  input SleepingHoursDayInput {
    start: String
    end: String
  }
  
  input SleepingHoursMatrixInput {
    sunday: SleepingHoursDayInput
    monday: SleepingHoursDayInput
    tuesday: SleepingHoursDayInput
    wednesday: SleepingHoursDayInput
    thursday: SleepingHoursDayInput
    friday: SleepingHoursDayInput
    saturday: SleepingHoursDayInput
  }
  
  input LifePreferredActivitiesMatrixInput {
    exercise: Boolean
    mindfulness: Boolean
    sleep: Boolean
    healthAwareness: Boolean
    reading: Boolean
    music: Boolean
    games: Boolean
    movies: Boolean
    cooking: Boolean
    socializing: Boolean
    sports: Boolean
    outdoorsExploration: Boolean
    travel: Boolean
    journaling: Boolean
    personalGrowth: Boolean
    creativeExpression: Boolean
    financialPlanning: Boolean
    digitalDetox: Boolean
    purposeAndMeaning: Boolean
    boundarySetting: Boolean
  }
  
  input WorkPreferredActivitiesMatrixInput {
    goalSetting: Boolean
    skillDevelopment: Boolean
    industryResearch: Boolean
    mentorship: Boolean
    softSkills: Boolean
    networking: Boolean
    branding: Boolean
    progressEvaluation: Boolean
    teamBuilding: Boolean
    teamFeedback: Boolean
    customerFeedback: Boolean
    qualityAssurance: Boolean
    brainstorming: Boolean
    innovationMindset: Boolean
    technologyIntegration: Boolean
    teamIntegration: Boolean
    milestoneCelebration: Boolean
    reverseMentorship: Boolean
    volunteering: Boolean
    entrepreneurship: Boolean
  }
  
  input EventSettingMatrixInput {
    completeAfterEnd: Boolean
  }
  
  input LayoutSettingMatrixInput {
    dashboardLayout: String
    viewStyle: String
  }
  
  input LocalizationSettingMatrixInput {
    timeZone: Int
    dateFormat: String
    timeFormat: String
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
    isAllDay: Boolean
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
    eventsByDate(user: ID!, eventStart: DateTime, eventEnd: DateTime): [Event]
    event(eventId: ID!): Event
    generatePresignedUrl(username: String!, fileName: String!): String
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, firstName: String!, middleName: String, lastName: String): Auth
    updateUser(username: String!, email: String!, password: String, birthDate: DateTime): User
    updateUserSettings(username: String!, colorModeSetting: String, eventSubtypes: [EventSubtypeInput], statSettings: StatSettingMatrixInput, sleepingHours: SleepingHoursMatrixInput, lifePreferredActivities: LifePreferredActivitiesMatrixInput, workPreferredActivities: WorkPreferredActivitiesMatrixInput, eventSettings: EventSettingMatrixInput, layoutSettings: LayoutSettingMatrixInput, localizationSettings: LocalizationSettingMatrixInput): User
    deleteUser(username: String!): DeleteUserResponse
    login(username: String!, password: String!): Auth
    addEvent(user: ID!, title: String!, type: String, subtype: String, details: String, eventStart: DateTime, eventEnd: DateTime, location: String, links: [String], files: [String], priority: String, isAllDay: Boolean, reminderTime: DateTime): Event
    updateEvent(eventId: ID!, title: String, type: String, subtype: String, details: String, eventStart: DateTime, eventEnd: DateTime, location: String, links: [String], files: [String], priority: String, isAllDay: Boolean, reminderTime: DateTime, completed: Boolean): Event
    removeEvent(eventId: ID!): Event
    deleteFile(username: String!, fileName: String!): Boolean
  }
`;

module.exports = typeDefs;
