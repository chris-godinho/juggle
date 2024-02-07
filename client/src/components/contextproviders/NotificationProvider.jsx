// NotificationProvider.jsx

import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationContent, setNotificationContent] = useState(null);
  const [notificationType, setNotificationType] = useState("neutral");
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
        <div className={`notification-jg ${notificationType === "work" ? "work-notification-jg" : notificationType === "life" ? "life-notification-jg" : ""}`}>
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
