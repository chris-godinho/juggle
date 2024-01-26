import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String!
    $middleName: String
    $lastName: String!
  ) {
    addUser(
      username: $username
      email: $email
      password: $password
      firstName: $firstName
      middleName: $middleName
      lastName: $lastName
    ) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $username: String!
    $email: String!
    $password: String
    $birthDate: DateTime
  ) {
    updateUser(
      username: $username
      email: $email
      password: $password
      birthDate: $birthDate
    ) {
      _id
      email
      password
      birthDate
    }
  }
`;

export const UPDATE_USER_SETTINGS = gql`
  mutation updateUserSettings(
    $username: String!
    $colorModeSetting: String
    $eventSubtypes: [EventSubtypeInput]
    $statSettings: StatSettingMatrixInput
    $sleepingHours: SleepingHoursMatrixInput
    $lifePreferredActivities: LifePreferredActivitiesMatrixInput
    $workPreferredActivities: WorkPreferredActivitiesMatrixInput
    $eventSettings: EventSettingMatrixInput
    $layoutSettings: LayoutSettingMatrixInput
    $localizationSettings: LocalizationSettingMatrixInput
  ) {
    updateUserSettings(
      username: $username
      colorModeSetting: $colorModeSetting
      eventSubtypes: $eventSubtypes
      statSettings: $statSettings
      sleepingHours: $sleepingHours
      lifePreferredActivities: $lifePreferredActivities
      workPreferredActivities: $workPreferredActivities
      eventSettings: $eventSettings
      layoutSettings: $layoutSettings
      localizationSettings: $localizationSettings
    ) {
      _id
      colorModeSetting
      eventSubtypes {
        subtype
        parentType
      }
      statSettings {
        showStats
        balanceGoal
        percentageBasis
        ignoreUnalotted
      }
      sleepingHours {
        sunday {
          start
          end
        }
        monday {
          start
          end
        }
        tuesday {
          start
          end
        }
        wednesday {
          start
          end
        }
        thursday {
          start
          end
        }
        friday {
          start
          end
        }
        saturday {
          start
          end
        }
      }
      lifePreferredActivities {
        exercise
        mindfulness
        sleep
        healthAwareness
        reading
        music
        games
        movies
        cooking
        socializing
        sports
        outdoorsExploration
        travel
        journaling
        personalGrowth
        creativeExpression
        financialPlanning
        digitalDetox
        purposeAndMeaning
        boundarySetting
      }
      workPreferredActivities {
        goalSetting
        skillDevelopment
        industryResearch
        mentorship
        softSkills
        networking
        branding
        progressEvaluation
        teamBuilding
        teamFeedback
        customerFeedback
        qualityAssurance
        brainstorming
        innovationMindset
        technologyIntegration
        teamIntegration
        milestoneCelebration
        reverseMentorship
        volunteering
        entrepreneurship
      }
      eventSettings {
        completeAfterEnd
      }
      layoutSettings {
        dashboardLayout
        viewStyle
      }
      localizationSettings {
        timeZone
        dateFormat
        timeFormat
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($username: String!) {
    deleteUser(username: $username) {
      success
      message
    }
  }
`;

export const ADD_EVENT = gql`
  mutation addEvent(
    $user: ID!
    $title: String!
    $type: String
    $subtype: String
    $details: String
    $eventStart: DateTime
    $eventEnd: DateTime
    $location: String
    $links: [String]
    $files: [String]
    $priority: String
    $setReminder: Boolean
    $reminderTime: DateTime
  ) {
    addEvent(
      user: $user
      title: $title
      type: $type
      subtype: $subtype
      details: $details
      eventStart: $eventStart
      eventEnd: $eventEnd
      location: $location
      links: $links
      files: $files
      priority: $priority
      setReminder: $setReminder
      reminderTime: $reminderTime
    ) {
      _id
      user
      title
      type
      subtype
      details
      eventStart
      eventEnd
      location
      links
      files
      priority
      setReminder
      reminderTime
      completed
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation updateEvent(
    $eventId: ID!
    $title: String!
    $type: String
    $subtype: String
    $details: String
    $eventStart: DateTime
    $eventEnd: DateTime
    $location: String
    $links: [String]
    $files: [String]
    $priority: String
    $setReminder: Boolean
    $reminderTime: DateTime
    $completed: Boolean
  ) {
    updateEvent(
      eventId: $eventId
      title: $title
      type: $type
      subtype: $subtype
      details: $details
      eventStart: $eventStart
      eventEnd: $eventEnd
      location: $location
      links: $links
      files: $files
      priority: $priority
      setReminder: $setReminder
      reminderTime: $reminderTime
      completed: $completed
    ) {
      _id
      user
      title
      type
      subtype
      details
      eventStart
      eventEnd
      location
      links
      files
      priority
      setReminder
      reminderTime
      completed
    }
  }
`;

export const REMOVE_EVENT = gql`
  mutation removeEvent($eventId: ID!) {
    removeEvent(eventId: $eventId) {
      _id
      user
      title
      type
      subtype
      details
      eventStart
      eventEnd
      location
      links
      files
      priority
      setReminder
      reminderTime
      completed
    }
  }
`;
