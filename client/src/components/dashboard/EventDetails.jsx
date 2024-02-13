// EventDetails.jsx

import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { useModal } from "../contextproviders/ModalProvider";
import { useNotification } from "../contextproviders/NotificationProvider.jsx";
import DataContext from "../contextproviders/DataContext";

import EventDetailsForm from "./EventDetailsForm";

import { UPDATE_EVENT, REMOVE_EVENT } from "../../utils/mutations";

import { validateEventForm } from "../../utils/eventUtils.js";

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
  eventIsAllDay,
  eventReminderTime,
  eventCompleted,
  eventSubtypes,
  eventsRefetch,
  showStats,
  refreshResponsiveGrid,
}) {
  console.log("[EventDetails.jsx] Component is rendering");

  const { openNotification } = useNotification();

  const { closeModal } = useModal();

  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [removeEvent] = useMutation(REMOVE_EVENT);

  let formattedStartDate = "";
  let formattedStartTime = "";

  if (!eventIsAllDay) {
    const eventStartDate = eventStart === null ? "" : new Date(eventStart);
    formattedStartDate =
      eventStartDate === ""
        ? ""
        : `${
            eventStartDate.getMonth() + 1
          }/${eventStartDate.getDate()}/${eventStartDate.getFullYear()}`;
    formattedStartTime =
      eventStartDate === ""
        ? ""
        : `${eventStartDate.getHours()}:${eventStartDate.getMinutes()}`;
  }

  const eventEndDate = eventEnd === null ? "" : new Date(eventEnd);
  const formattedEndDate =
    eventEndDate === ""
      ? ""
      : `${
          eventEndDate.getMonth() + 1
        }/${eventEndDate.getDate()}/${eventEndDate.getFullYear()}`;
  const formattedEndTime =
    eventEndDate === ""
      ? ""
      : `${eventEndDate.getHours()}:${eventEndDate.getMinutes()}`;

  const reminderDate =
    eventReminderTime === null ? "" : new Date(eventReminderTime);
  const formattedReminderDate =
    reminderDate === ""
      ? ""
      : `${
          reminderDate.getMonth() + 1
        }/${reminderDate.getDate()}/${reminderDate.getFullYear()}`;
  const formattedReminderTime =
    reminderDate === ""
      ? ""
      : `${reminderDate.getHours()}:${reminderDate.getMinutes()}`;

  const [eventScreen, setEventScreen] = useState("EventDetails");

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
    isAllDay: eventIsAllDay || false,
    completed: eventCompleted || "",
    reminderDate: formattedReminderDate || "",
    reminderTime: formattedReminderTime || "",
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log("[EventDetails.jsx] handleFormSubmit()");
      console.log("[EventDetails.jsx] formData:", formData);

      const { finalFormData, errorMessage } = validateEventForm(
        formData,
        showStats
      );

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      const { data } = await updateEvent({
        variables: { eventId, ...finalFormData },
      });

      closeModal();

      refreshResponsiveGrid("change");
    } catch (error) {
      openNotification(
        <p>{error ? error.message : "An error occurred. Please try again."}</p>,
        "error"
      );
    }
  };

  console.log("[EventDetails.jsx] formData:", formData);

  const handleDeleteEvent = async (event) => {
    event.preventDefault();

    console.log("[EventDetails.jsx] handleDeleteEvent - eventId:", eventId);

    try {
      const removedEvent = await removeEvent({
        variables: { eventId: eventId },
      });

      console.log("[EventDetails.jsx] removeEvent:", removedEvent);

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
              <EventDetailsForm formType="edit" showStats={showStats} />
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
