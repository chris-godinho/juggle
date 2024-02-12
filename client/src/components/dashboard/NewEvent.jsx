// NewEvent.jsx

import { useState } from "react";
import { useMutation } from "@apollo/client";

import { useModal } from "../contextproviders/ModalProvider";
import { useNotification } from "../contextproviders/NotificationProvider.jsx";
import DataContext from "../contextproviders/DataContext";

import EventDetailsForm from "./EventDetailsForm";

import { ADD_EVENT } from "../../utils/mutations";

import { validateEventForm } from "../../utils/eventUtils.js";

const NewEvent = ({ eventSubtypes, userId, showStats, refreshResponsiveGrid }) => {
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
    isAllDay: false,
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

      const { finalFormData, errorMessage } = validateEventForm(
        formData,
        showStats
      );

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      const { data } = await addEvent({
        variables: { user: userId, ...finalFormData },
      });

      setFormData({});

      closeModal();

      refreshResponsiveGrid("change");

    } catch (error) {
      openNotification(
        <p>{error ? error.message : "An error occurred. Please try again."}</p>,
        "error"
      );
    }
  };

  console.log("[NewEvent.jsx] formData:", formData);

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
