// EventDetails.jsx

import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

import { UPDATE_EVENT, REMOVE_EVENT } from "../utils/mutations";

import { useModal } from "./ModalProvider";

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
  eventsRefetch
}) {
  console.log("[EventDetails.jsx] Component is rendering");

  const { closeModal } = useModal();

  const [updateEvent] = useMutation(UPDATE_EVENT);
  const [removeEvent] = useMutation(REMOVE_EVENT);

  const eventStartDate = new Date(eventStart);
  const eventEndDate = new Date(eventEnd);
  const formattedStartDate = `${
    eventStartDate.getMonth() + 1
  }/${eventStartDate.getDate()}/${eventStartDate.getFullYear()}`;
  const formattedStartTime = `${eventStartDate.getHours()}:${eventStartDate.getMinutes()}`;
  const formattedEndDate = `${
    eventEndDate.getMonth() + 1
  }/${eventEndDate.getDate()}/${eventEndDate.getFullYear()}`;
  const formattedEndTime = `${eventEndDate.getHours()}:${eventEndDate.getMinutes()}`;

  const [eventScreen, setEventScreen] = useState("EventDetails");
  const [isTitleEditable, setIsTitleEditable] = useState(false);

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
    setReminder: eventSetReminder || "",
    reminderTime: eventReminderTime || "",
    completed: eventCompleted || "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // For checkbox inputs, use the checked property
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === "subtype") {
      const selectedSubtype = eventSubtypes.find(
        (subtype) => subtype.subtype.toLowerCase() === value.toLowerCase()
      );
      if (selectedSubtype) {
        // Handle category change and update corresponding type
        const correspondingType = selectedSubtype.parentType;
        setFormData((prevData) => {
          const newData = {
            ...prevData,
            [name]: value,
            type: correspondingType,
          };
          console.log("[NewEvent.jsx] Updated formData:", newData);
          return newData;
        });
      }
    } else if (name === "type") {
      if (formData.subtype) {
        // Handle category change and update corresponding type
        const correspondingSubtype = eventSubtypes.find(
          (subtype) => subtype.parentType.toLowerCase() === value.toLowerCase()
        );
        if (correspondingSubtype !== formData.subtype) {
          setFormData((prevData) => {
            const newData = {
              ...prevData,
              [name]: value,
              subtype: "",
            };
            console.log("[NewEvent.jsx] Updated formData:", newData);
            return newData;
          });
        }
      }
    } else {
      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value };
        console.log("[NewEvent.jsx] Updated formData:", newData);
        return newData;
      });
    }

    console.log("[UserProfile.jsx] handleChange - formData:", name, value);
  };

  const togglePriority = () => {
    // Determine the new priority based on the current value
    const newPriority =
      formData.priority === "High"
        ? "Normal"
        : formData.priority === "Normal"
        ? "Low"
        : "High";

    // Update the formData state
    setFormData((prevData) => ({
      ...prevData,
      priority: newPriority,
    }));

    console.log("[UserProfile.jsx] togglePriority - newPriority:", newPriority);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formattedEventStart = new Date(
      `${formData.startDate} ${formData.startTime}`
    );
    const formattedEventEnd = new Date(
      `${formData.endDate} ${formData.endTime}`
    );

    const formattedFormData = {
      ...formData,
      eventStart: formattedEventStart,
      eventEnd: formattedEventEnd,
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

  // ... (existing code)

  const handleTitleClick = () => {
    // Set the edit mode to true when the title is clicked
    setIsTitleEditable(true);
  };

  const handleTitleBlur = () => {
    // Set the edit mode to false when the input field loses focus
    setIsTitleEditable(false);
  };

  // TODO: Make title editable (click to edit)
  return (
    <div className="modal-jg event-details-modal-container-jg">
      <div className="modal-content-jg">
        {eventScreen === "EventDetails" ? (
          <>
            <a href="#" className="modal-close-button-jg" onClick={closeModal}>
              <span className="material-symbols-outlined">close</span>
            </a>
            <form>
              <div className="event-details-title-line-jg">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed || ""}
                  onChange={handleInputChange}
                />
                <label key="event-complete-jg" title="Click to Edit">
                  {isTitleEditable ? (
                    // Render an input field when in edit mode
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      onBlur={handleTitleBlur}
                      className={
                        formData.type === "work"
                          ? "event-title-input-jg work-text-jg"
                          : "event-title-input-jg life-text-jg"
                      }
                    />
                  ) : (
                    // Render a non-editable h1 element when not in edit mode
                    <h1
                      className={
                        formData.type === "work"
                          ? "event-title-jg work-text-jg"
                          : "event-title-jg life-text-jg"
                      }
                      id={formData.completed ? "strikethrough-jg" : ""}
                      onClick={handleTitleClick}
                    >
                      {formData.title}
                    </h1>
                  )}
                </label>
                <div className="priority-icon-container-jg">
                  <span
                    onClick={togglePriority}
                    className={
                      formData.type === "work"
                        ? "material-symbols-outlined priority-icon-jg work-text-jg"
                        : "material-symbols-outlined priority-icon-jg life-text-jg"
                    }
                    id={
                      formData.priority === "High"
                        ? "priority-icon-high-jg"
                        : formData.priority === "Low"
                        ? "priority-icon-low-jg"
                        : ""
                    }
                  >
                    {formData.priority === "High"
                      ? "arrow_circle_up"
                      : formData.priority === "Normal"
                      ? "pending"
                      : "arrow_circle_down"}
                  </span>
                </div>
              </div>
              <div className="event-details-line-jg">
                <p className="event-details-label-jg">Details</p>
                <input
                  type="text"
                  name="details"
                  value={formData.details || ""}
                  className="event-input-jg"
                  placeholder="Details"
                  onChange={handleInputChange}
                />
              </div>
              <div className="event-details-line-jg">
                <p className="event-details-label-jg">Start Date</p>
                <Flatpickr
                  name="startDate"
                  value={formData.startDate || ""}
                  options={{
                    dateFormat: "m/d/Y",
                    allowInput: true,
                    closeOnSelect: true,
                    clickOpens: true,
                  }}
                  className="event-input-jg event-datepicker-jg"
                  onChange={(selectedDates, dateString, instance) => {
                    console.log(
                      "[Dashboard.jsx] startDate onChange:",
                      selectedDates,
                      dateString,
                      instance
                    );
                    handleInputChange({
                      target: {
                        name: "startDate",
                        value: dateString,
                      },
                    });
                  }}
                />
                <p className="event-details-label-jg event-middle-label-jg">
                  Start Time
                </p>
                <Flatpickr
                  name="startTime"
                  value={formData.startTime || ""}
                  className="event-input-jg event-datepicker-jg"
                  options={{
                    noCalendar: true,
                    enableTime: true,
                    allowInput: true,
                    dateFormat: "h:i K",
                    closeOnSelect: true,
                    clickOpens: true,
                  }}
                  onChange={(selectedDates, dateString, instance) => {
                    console.log(
                      "[Dashboard.jsx] startTime onChange:",
                      selectedDates,
                      dateString,
                      instance
                    );
                    handleInputChange({
                      target: {
                        name: "startTime",
                        value: dateString,
                      },
                    });
                  }}
                />
              </div>
              <div className="event-details-line-jg">
                <p className="event-details-label-jg">End Date</p>
                <Flatpickr
                  name="endDate"
                  value={formData.endDate || ""}
                  className="event-input-jg event-datepicker-jg"
                  options={{
                    dateFormat: "m/d/Y",
                    allowInput: true,
                    closeOnSelect: true,
                    clickOpens: true,
                  }}
                  onChange={(selectedDates, dateString, instance) => {
                    console.log(
                      "[Dashboard.jsx] endDate onChange:",
                      selectedDates,
                      dateString,
                      instance
                    );
                    handleInputChange({
                      target: {
                        name: "endDate",
                        value: dateString,
                      },
                    });
                  }}
                />
                <p className="event-details-label-jg event-middle-label-jg">
                  End Time
                </p>
                <Flatpickr
                  name="endTime"
                  value={formData.endTime || ""}
                  className="event-input-jg event-datepicker-jg"
                  options={{
                    noCalendar: true,
                    enableTime: true,
                    allowInput: true,
                    dateFormat: "h:i K",
                    closeOnSelect: true,
                    clickOpens: true,
                  }}
                  onChange={(selectedDates, dateString, instance) => {
                    console.log(
                      "[Dashboard.jsx] endTime onChange:",
                      selectedDates,
                      dateString,
                      instance
                    );
                    handleInputChange({
                      target: {
                        name: "endTime",
                        value: dateString,
                      },
                    });
                  }}
                />
              </div>
              <div className="event-details-line-jg">
                <p className="event-details-label-jg">Category</p>
                <select
                  className="event-input-jg event-select-jg"
                  name="subtype"
                  value={formData.subtype || ""}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  {eventSubtypes &&
                    eventSubtypes.map((subtype, index) => (
                      <option key={index} value={subtype.subtype}>
                        {subtype.subtype}
                      </option>
                    ))}
                </select>
                <p className="event-details-label-jg event-middle-label-jg">
                  Type
                </p>
                <select
                  className="event-input-jg event-select-jg"
                  name="type"
                  value={formData.type || ""}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  <option value="work">Work</option>
                  <option value="life">Life</option>
                </select>
              </div>
              <div className="event-details-line-jg">
                <p className="event-details-label-jg">Location</p>
                <input
                  type="text"
                  name="location"
                  value={formData.location || ""}
                  className="event-input-jg"
                  placeholder="Location"
                  onChange={handleInputChange}
                />
              </div>
              <div className="event-details-button-tray-jg">
                <button
                  className="button-jg"
                  type="submit"
                  onClick={handleFormSubmit}
                >
                  Save
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
            </form>
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
  );
}
