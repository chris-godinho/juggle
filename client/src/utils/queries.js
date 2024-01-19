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
      colorModeSetting
      eventSubtypes {
        subtype
        category
      }
      events {
        _id
        user
        title
        type
        subtype
        details
        startDate
        startTime
        endDate
        endTime
        location
        links
        files
      }
    }
  }
`;

export const QUERY_EVENTS = gql`
  query getEvents($username: String) {
    events(username: $username) {
      _id
      user
      title
      type
      subtype
      details
      startDate
      startTime
      endDate
      endTime
      location
      links
      files
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
      startDate
      startTime
      endDate
      endTime
      location
      links
      files
    }
  }
`;
