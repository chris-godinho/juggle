import { gql } from '@apollo/client';

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
        setReminder
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
      setReminder
      reminderTime
      completed
    }
  }
`;

export const QUERY_EVENTS_BY_DATE = gql`
  query getEventsByDate($user: ID!, $eventStart: DateTime) {
    eventsByDate(user: $user, eventStart: $eventStart) {
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
      setReminder
      reminderTime
      completed
    }
  }
`;
