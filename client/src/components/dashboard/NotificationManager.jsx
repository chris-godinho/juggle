// NotificationManager.jsx

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { useDataContext } from "../contextproviders/DataContext";
import { useNotification } from "../contextproviders/NotificationProvider.jsx";

import { QUERY_EVENTS_BY_USER } from "../../utils/queries";

const NotificationManager = () => {
  const { openNotification } = useNotification();

  const [events, setEvents] = useState([]);

  const { fetchedSettings } = useDataContext();

  const {
    loading: notificationLoading,
    data: notificationData,
    error: notificationError,
    refetch: notificationRefetch,
  } = useQuery(QUERY_EVENTS_BY_USER, {
    variables: { user: fetchedSettings.userId },
  });

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

  const scheduleEventNotifications = (events) => {
    events.forEach((event) => {
      if (event.reminderTime !== undefined) {
        const now = new Date();

        const eventStart = new Date(event.eventStart);
        const timeUntilEvent = new Date(eventStart) - now;

        const eventReminderTime = new Date(event.reminderTime);
        const timeUntilReminder = eventReminderTime - now;

        if (timeUntilEvent > 0) {
          setTimeout(() => {
            // Call a function to display the notification
            openNotification(
              `Reminder: ${event.title} is starting at ${event.eventStart}.`,
              event.type.toLowerCase()
            );
            console.log(`Notification for event: ${event.title}`);
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
