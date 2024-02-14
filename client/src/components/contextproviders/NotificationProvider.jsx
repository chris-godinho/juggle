// NotificationProvider.jsx
// Adds and sets timers for modal notifications

import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Stores the HTML content to be displayed in the notification
  const [notificationContent, setNotificationContent] = useState(null);
  // Stores the type of notification (neutral, work or life for event reminders, error for error messages)
  const [notificationType, setNotificationType] = useState("neutral");
  // Stores notification open/closed state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const openNotification = (content, type = "neutral") => {
    setNotificationContent(content);
    setNotificationType(type);
    setIsNotificationOpen(true);
  };

  const closeNotification = () => {
    setNotificationContent(null);
    setIsNotificationOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{ openNotification, closeNotification }}
    >
      {children}
      {isNotificationOpen && notificationContent && (
        <div className={`notification-jg ${notificationType === "work" ? "work-notification-jg" : notificationType === "life" ? "life-notification-jg" : notificationType === "error" ? "error-notification-jg" : ""}`}>
          <a
            href="#"
            className={`notification-close-button-jg ${notificationType === "work" ? "work-notification-close-button-jg" : notificationType === "life" ? "life-notification-close-button-jg" : ""}`}
            onClick={closeNotification}
          >
            <span className="material-symbols-outlined notification-close-button-icon-jg">close</span>
          </a>
          <div className="notification-content-jg">{notificationContent}</div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
