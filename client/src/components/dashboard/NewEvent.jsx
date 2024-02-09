// NewEvent.jsx

import { useState } from "react";
import { useMutation } from "@apollo/client";

import DataContext from "../contextproviders/DataContext.jsx";
import { useModal } from "../contextproviders/ModalProvider";
import { useNotification } from "../contextproviders/NotificationProvider.jsx";

import EventDetailsForm from "./EventDetailsForm";

import { ADD_EVENT } from "../../utils/mutations";

const NewEvent = ({ eventSubtypes, userId, showStats }) => {
  console.log("[NewEvent.jsx] Component is rendering");

  const { openNotification } = useNotification();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    subtype: "",
    details: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    links: "",
    files: "",
    priority: "Normal",
    reminderDate: "",
    reminderTime: "",
  });

  // Set up GraphQL mutation for adding events
  const [addEvent, { error, data }] = useMutation(ADD_EVENT);

  const { closeModal } = useModal();

  const handleFormSubmit = async () => {

    // Add event to database
    try {

      console.log("[NewEvent.jsx] handleFormSubmit()");
      console.log("[NewEvent.jsx] formData:", formData);
  
      if (formData.title === "") {
        throw new Error("Please enter a title for the event.");
      }

      console.log("[NewEvent.jsx] formData.type:", formData.type);

      if (formData.type === "" && showStats) {
        throw new Error("Please select a type for the event.");
      }

      if (formData.type === "" && !showStats) {
        formData.type = "unspecified";
      }

      if ((formData.startDate === "" || formData.startTime === "") && (formData.endDate !== "" || formData.endTime !== "")) {
        throw new Error("Event start date and time must be set when setting an end date/time.");
      }

      if ((formData.startDate !== "" || formData.startTime !== "") && ((formData.endDate === "" && formData.endTime !== "") || (formData.endDate !== "" && formData.endTime === ""))) {
        throw new Error("Please enter both an end date and time.");
      }

      // Combine startDate and startTime into eventStart
      const eventStartDate = formData.startDate || new Date().toLocaleDateString();
      const eventStartTime = formData.startTime || "00:00";
      const eventStart = new Date(`${eventStartDate} ${eventStartTime}`);
  
      // Combine endDate and endTime into eventEnd
      const eventEndDate = formData.endDate;
      const eventEndTime = formData.endTime || "00:00";
      const eventEnd = new Date(`${eventEndDate} ${eventEndTime}`);

      console.log("[NewEvent.jsx] eventStart:", eventStart);
      console.log("[NewEvent.jsx] eventEnd:", eventEnd);

      if (eventEnd < eventStart) {
        throw new Error("Event end date must be later than the start date.");
      }

      // Combine reminderDate and reminderTime into eventReminderTime
      const eventReminderTime = formData.reminderTime || "00:00";
      let eventReminderDate;
      if (formData.reminderDate === "" && formData.reminderTime !== "") {
        eventReminderDate = eventStartDate;
      } else {
        eventReminderDate = formData.reminderDate;
      }
      const reminderTime = new Date(`${eventReminderDate} ${eventReminderTime}`);

      if (reminderTime > eventStart) {
        throw new Error(
          "Reminder must be set for a time before the start of the event."
        );
      }

      // Create the final form data
      const finalFormData = {
        ...formData,
        eventStart,
        eventEnd,
        reminderTime,
      };

      const { data } = await addEvent({
        variables: { user: userId, ...finalFormData },
      });

      setFormData({});

      closeModal();
    } catch (error) {
      openNotification(
        <p>{error ? error.message : "An error occurred. Please try again."}</p>,
        "error"
      );
    }
  };

  return (
    <DataContext.Provider value={{ formData, setFormData, eventSubtypes }}>
      <div className="modal-jg event-details-modal-container-jg">
        <div className="modal-content-jg">
          <a href="#" className="modal-close-button-jg" onClick={closeModal}>
            <span className="material-symbols-outlined">close</span>
          </a>
          <EventDetailsForm formType="new" showStats={showStats} />
          <div className="new-event-details-button-tray-jg">
            <button
              className="button-jg"
              onClick={() => handleFormSubmit("Submit", formData)}
            >
              Submit
            </button>
            <button className="button-jg" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
};

export default NewEvent;
