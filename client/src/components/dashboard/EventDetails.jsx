// EventDetails.jsx

import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import DataContext from "../contextproviders/DataContext.jsx";
import { useModal } from "../contextproviders/ModalProvider";

import EventDetailsForm from "./EventDetailsForm";

import { UPDATE_EVENT, REMOVE_EVENT } from "../../utils/mutations";

export default function EventDetails({
  eventId,
  eventTitle,
  eventType,
  eventSubtype,
  eventDescription,
  eventStart,
  eventEnd,
  eventLocation,
  eventLinks,
  eventFiles,
  eventPriority,
  eventSetReminder,
  eventReminderTime,
  eventCompleted,
  eventSubtypes,
  eventsRefetch,
  showStats,
}) {
  console.log("[EventDetails.jsx] Component is rendering");

  const { closeModal } = useModal();

  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [removeEvent] = useMutation(REMOVE_EVENT);

  const eventStartDate = new Date(eventStart);
  const eventEndDate = new Date(eventEnd);
  const reminderDate = new Date(eventReminderTime);
  const formattedStartDate = `${
    eventStartDate.getMonth() + 1
  }/${eventStartDate.getDate()}/${eventStartDate.getFullYear()}`;
  const formattedStartTime = `${eventStartDate.getHours()}:${eventStartDate.getMinutes()}`;
  const formattedEndDate = `${
    eventEndDate.getMonth() + 1
  }/${eventEndDate.getDate()}/${eventEndDate.getFullYear()}`;
  const formattedEndTime = `${eventEndDate.getHours()}:${eventEndDate.getMinutes()}`;
  const formattedReminderDate = `${
    reminderDate.getMonth() + 1
  }/${reminderDate.getDate()}/${reminderDate.getFullYear()}`;
  const formattedReminderTime = `${reminderDate.getHours()}:${reminderDate.getMinutes()}`;

  const [eventScreen, setEventScreen] = useState("EventDetails");

  console.log(
    "[EventDetails.jsx] eventCompleted:",
    eventCompleted,
    "typeof eventCompleted:",
    typeof eventCompleted
  );

  const [formData, setFormData] = useState({
    title: eventTitle || "",
    type: eventType || "",
    subtype: eventSubtype || "",
    details: eventDescription || "",
    startDate: formattedStartDate || "",
    startTime: formattedStartTime || "",
    endDate: formattedEndDate || "",
    endTime: formattedEndTime || "",
    location: eventLocation || "",
    links: eventLinks || "",
    files: eventFiles || "",
    priority: eventPriority || "",
    completed: eventCompleted || "",
    reminderDate: formattedReminderDate || "",
    reminderTime: formattedReminderTime || "",
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formattedEventStart = new Date(
      `${formData.startDate} ${formData.startTime}`
    );
    const formattedEventEnd = new Date(
      `${formData.endDate} ${formData.endTime}`
    );
    const formattedReminder = new Date(
      `${formData.reminderDate} ${formData.reminderTime}`
    );

    const formattedFormData = {
      ...formData,
      eventStart: formattedEventStart,
      eventEnd: formattedEventEnd,
      reminderTime: formattedReminder,
    };

    console.log("[EventDetails.jsx] formattedFormData:", formattedFormData);

    try {
      const { data } = await updateEvent({
        variables: { eventId, ...formattedFormData },
      });

      console.log("[EventDetails.jsx] data:", data);

      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteEvent = async (event) => {
    event.preventDefault();

    console.log("[EventDetails.jsx] handleDeleteEvent - eventId:", eventId);

    try {
      const removedEvent = await removeEvent({
        variables: { eventId: eventId },
      });

      console.log("[UserProfile.jsx] removeEvent:", removedEvent);

      eventsRefetch();
      closeModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DataContext.Provider value={{ formData, setFormData, eventSubtypes }}>
      <div className="modal-jg event-details-modal-container-jg">
        <div className="modal-content-jg">
          {eventScreen === "EventDetails" ? (
            <>
              <a
                href="#"
                className="modal-close-button-jg"
                onClick={closeModal}
              >
                <span className="material-symbols-outlined">close</span>
              </a>
              <EventDetailsForm formType="edit" showStats={showStats}/>
              <div className="event-details-button-tray-jg">
                <button
                  className="button-jg"
                  type="submit"
                  onClick={handleFormSubmit}
                >
                  Save
                </button>
                <button className="button-jg" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="button-jg event-delete-button-jg"
                  onClick={(event) => {
                    event.preventDefault();
                    setEventScreen("confirmDelete");
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div>
              <p>Are you sure you want to delete this event?</p>
              <div className="event-details-button-tray-jg">
                <button
                  className="button-jg"
                  onClick={() => setEventScreen("EventDetails")}
                >
                  Cancel
                </button>
                <button
                  className="button-jg event-delete-button-jg"
                  type="submit"
                  onClick={handleDeleteEvent}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DataContext.Provider>
  );
}
