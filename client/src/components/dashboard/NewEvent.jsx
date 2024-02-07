// NewEvent.jsx

import { useState } from "react";
import { useMutation } from "@apollo/client";

import DataContext from "../contextproviders/DataContext.jsx";
import { useModal } from "../contextproviders/ModalProvider";

import EventDetailsForm from "./EventDetailsForm";

import { ADD_EVENT } from "../../utils/mutations";

const NewEvent = ({ eventSubtypes, userId }) => {
  console.log("[NewEvent.jsx] Component is rendering");

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
    // Combine startDate and startTime into eventStart
    const eventStartDate = formData.startDate;
    const eventStartTime = formData.startTime || "00:00";
    const eventStart = new Date(`${eventStartDate} ${eventStartTime}`);

    // Combine endDate and endTime into eventEnd
    const eventEndDate = formData.endDate;
    const eventEndTime = formData.endTime || "00:00";
    const eventEnd = new Date(`${eventEndDate} ${eventEndTime}`);

    // Combine reminderDate and reminderTime into eventReminderTime
    const eventReminderDate = formData.reminderDate;
    const eventReminderTime = formData.reminderTime || "00:00";
    const reminderTime = new Date(`${eventReminderDate} ${eventReminderTime}`);

    // Create the final form data
    const finalFormData = {
      ...formData,
      eventStart,
      eventEnd,
      reminderTime,
    };

    // Add event to database
    try {
      const { data } = await addEvent({
        variables: { user: userId, ...finalFormData },
      });
      setFormData({});
    } catch (e) {
      console.error(e);
    }
    closeModal();
  };

  return (
    <DataContext.Provider
      value={{ formData, setFormData, eventSubtypes }}
    >
      <div className="modal-jg event-details-modal-container-jg">
        <div className="modal-content-jg">
          <a href="#" className="modal-close-button-jg" onClick={closeModal}>
            <span className="material-symbols-outlined">close</span>
          </a>
          <EventDetailsForm formType="new" />
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
