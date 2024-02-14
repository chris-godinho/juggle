// NotificationManager.jsx
// Sets up and manages event notifications

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { useDataContext } from "../contextproviders/DataContext";
import { useNotification } from "../contextproviders/NotificationProvider.jsx";

import { QUERY_EVENTS_BY_USER } from "../../utils/queries";

const NotificationManager = () => {
  const { openNotification } = useNotification();

  const [events, setEvents] = useState([]);

  const { fetchedSettings } = useDataContext();

  // Find all events for the current user
  const {
    loading: notificationLoading,
    data: notificationData,
    error: notificationError,
    refetch: notificationRefetch,
  } = useQuery(QUERY_EVENTS_BY_USER, {
    variables: { user: fetchedSettings.userId },
  });

  // When the notification data is loaded, set the events and reset the event notifications
  useEffect(() => {
    if (!notificationLoading && notificationData) {
      setEvents(notificationData?.eventsByUser || []);
      resetEventNotifications(events);
    }
  }, [notificationLoading, notificationData]);

  const resetEventNotifications = (events) => {
    // Clear existing timeouts
    clearTimeouts();

    // Schedule notifications for updated events
    scheduleEventNotifications(events);
  };

  const clearTimeouts = () => {
    // Implement logic to clear existing timeouts
    // You need to keep track of timeout IDs for each scheduled notification
    // and use clearTimeout to cancel them.
    // Example: clearTimeout(timeoutId);
  };

  // Schedule notifications for events with reminder times
  const scheduleEventNotifications = (events) => {
    events.forEach((event) => {
      if (event.reminderTime !== undefined) {

        const now = new Date();

        const eventStart = new Date(event.eventStart);
        const timeUntilEvent = eventStart - now;

        // Format string for notification content
        const eventHours = eventStart.getHours();
        const eventMinutes = eventStart.getMinutes();
        let formattedMinutes = (eventMinutes < 10) ? '0' + eventMinutes : '' + eventMinutes;
        const amPm = eventHours >= 12 ? "PM" : "AM";
        const formattedEventTime = `${eventHours % 12}:${formattedMinutes} ${amPm}`;

        const formattedEventStart = `on ${
          eventStart.getMonth() + 1
        }/${eventStart.getDate()}/${eventStart.getFullYear()} at ${formattedEventTime}`;

        const eventReminderTime = new Date(event.reminderTime);
        const timeUntilReminder = eventReminderTime - now;

        // Set timer to display the notification
        if (timeUntilEvent > 0 && timeUntilReminder > 0) {
          setTimeout(() => {
            // Call a function to display the notification
            openNotification(
              <p>
                Reminder: {event.title} is starting {formattedEventStart}.
              </p>,
              event.type.toLowerCase()
            );
            // After displaying the notification, refetch events to update the UI
            notificationRefetch();
          }, timeUntilReminder);
        }
      }
    });
  };

  if (notificationLoading) return <p>Loading...</p>;
  if (notificationError) return <p>Error: {error.message}</p>;

  return null; // This component doesn't render anything; it handles the notification logic
};

export default NotificationManager;
