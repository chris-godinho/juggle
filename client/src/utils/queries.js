import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      firstName
      middleName
      lastName
      birthDate
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
      events {
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
        isAllDay
        reminderTime
        completed
      }
    }
  }
`;

export const QUERY_EVENTS_BY_USER = gql`
  query getEventsByUser($user: ID!) {
    eventsByUser(user: $user) {
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
      isAllDay
      reminderTime
      completed
    }
  }
`;

export const QUERY_EVENTS_BY_DATE = gql`
  query getEventsByDate($user: ID!, $eventStart: DateTime, $eventEnd: DateTime) {
    eventsByDate(user: $user, eventStart: $eventStart, eventEnd: $eventEnd) {
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
      isAllDay
      reminderTime
      completed
    }
  }
`;

export const QUERY_SINGLE_EVENT = gql`
  query getSingleEvent($eventId: ID!) {
    event(eventId: $eventId) {
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
      isAllDay
      reminderTime
      completed
    }
  }
`;

export const GET_PRESIGNED_URL = gql`
  query GetPresignedUrl($username: String!, $fileName: String!) {
    generatePresignedUrl(username: $username, fileName: $fileName)
  }
`;
