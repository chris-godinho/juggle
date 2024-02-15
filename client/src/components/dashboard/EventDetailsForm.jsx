// EventDetailsForm.jsx
// Form component for New Event and Event Details modals

import React, { useState } from "react";

import { useDataContext } from "../contextproviders/DataContext";

import Flatpickr from "react-flatpickr";

// Import default flatpickr styles
import "flatpickr/dist/themes/dark.css";

export default function EventDetailsForm({ formType, showStats }) {
  const { formData, setFormData, eventSubtypes } = useDataContext();

  // Set up state for title edit mode
  const [isTitleEditable, setIsTitleEditable] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // For checkbox inputs, use the checked property
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === "subtype") {
      if (value !== "") {
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
            return newData;
          });
        }
      } else {
        setFormData((prevData) => {
          const newData = { ...prevData, [name]: value, type: "" };
          return newData;
        });
      }
    } else if (name === "type" && formData.subtype) {
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
          return newData;
        });
      }
    } else {
      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value };
        return newData;
      });
    }
  };

  // Handle priority change
  const togglePriority = () => {
    // Determine the new priority based on the current value
    const newPriority =
      formData.priority === "High"
        ? "Normal"
        : formData.priority === "Normal"
        ? "Low"
        : "High";

    // Update formData
    setFormData((prevData) => ({
      ...prevData,
      priority: newPriority,
    }));
  };

  const handleTitleClick = () => {
    // Set the edit mode to true when the title is clicked
    setIsTitleEditable(true);
  };

  const handleTitleBlur = () => {
    // Set the edit mode to false when the input field loses focus
    setIsTitleEditable(false);
  };

  return (
    <form>
      <div
        className={
          formType === "new"
            ? "new-event-details-title-line-jg"
            : "event-details-title-line-jg"
        }
      >
        {formType === "edit" && (
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed || false}
            onChange={handleInputChange}
          />
        )}
        <label
          key="event-complete-jg"
          title={
            formType === "new" ? "Enter event title here" : "Click to edit"
          }
        >
          {formType === "new" ? (
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              className={
                formData.type === "work"
                  ? "new-event-title-input-jg work-text-jg"
                  : formData.type === "life"
                  ? "new-event-title-input-jg life-text-jg"
                  : "new-event-title-input-jg"
              }
              placeholder="Title"
              onChange={handleInputChange}
            />
          ) : (
            <>
              {isTitleEditable ? (
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
            </>
          )}
        </label>
        <div className="priority-icon-container-jg">
          <span
            onClick={togglePriority}
            title={`Event priority: ${formData.priority}`}
            className={
              formData.type === "work"
                ? "material-symbols-outlined priority-icon-jg work-text-jg"
                : formData.type === "life"
                ? "material-symbols-outlined priority-icon-jg life-text-jg"
                : "material-symbols-outlined priority-icon-jg"
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
      <div className="event-details-line-jg event-full-length-label-input-jg">
        <p className="event-details-label-jg">Details</p>
        <input
          type="text"
          name="details"
          value={formData.details || ""}
          className="event-input-jg event-text-input-jg"
          placeholder="Details"
          onChange={handleInputChange}
        />
      </div>
      <div className="event-details-line-jg">
        <div className="event-half-length-label-input-jg">
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
            className="event-input-jg event-datepicker-jg event-left-input-jg"
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
        </div>
        <div className="event-half-length-label-input-jg">
          <p className="event-details-label-jg event-middle-label-jg">
            Start Time
          </p>
          <Flatpickr
            name="startTime"
            value={formData.startTime || ""}
            className="event-input-jg event-datepicker-jg event-middle-input-jg"
            options={{
              noCalendar: true,
              enableTime: true,
              allowInput: true,
              dateFormat: "h:i K",
              closeOnSelect: true,
              clickOpens: true,
              minuteIncrement: 30,
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
      </div>
      <div className="event-details-line-jg">
        <div className="event-half-length-label-input-jg">
          <p className="event-details-label-jg">End Date</p>
          <Flatpickr
            name="endDate"
            value={formData.endDate || ""}
            className="event-input-jg event-datepicker-jg event-left-input-jg"
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
        </div>
        <div className="event-half-length-label-input-jg">
          <p className="event-details-label-jg event-middle-label-jg">
            End Time
          </p>
          <Flatpickr
            name="endTime"
            value={formData.endTime || ""}
            className="event-input-jg event-datepicker-jg event-middle-input-jg"
            options={{
              noCalendar: true,
              enableTime: true,
              allowInput: true,
              dateFormat: "h:i K",
              closeOnSelect: true,
              clickOpens: true,
              minuteIncrement: 30,
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
      </div>
      {showStats && (
        <div className="event-details-line-jg">
          <div className="event-half-length-label-input-jg">
            <p className="event-details-label-jg">Category</p>
            <select
              className="event-input-jg event-select-jg event-left-input-jg"
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
          </div>
          <div className="event-half-length-label-input-jg">
            <p className="event-details-label-jg event-middle-label-jg">Type</p>
            <select
              className="event-input-jg event-select-jg event-middle-input-jg"
              name="type"
              value={formData.type || ""}
              onChange={handleInputChange}
            >
              <option value=""></option>
              <option value="work">Work</option>
              <option value="life">Life</option>
            </select>
          </div>
        </div>
      )}
      <div className="event-details-line-jg event-full-length-label-input-jg">
        <p className="event-details-label-jg">Location</p>
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          className="event-input-jg event-text-input-jg"
          placeholder="Location"
          onChange={handleInputChange}
        />
      </div>
      <div className="event-details-line-jg">
        <div className="event-half-length-label-input-jg">
          <p className="event-details-label-jg">Reminder Date</p>
          <Flatpickr
            name="reminderDate"
            value={formData.reminderDate || ""}
            options={{
              dateFormat: "m/d/Y",
              allowInput: true,
              closeOnSelect: true,
              clickOpens: true,
            }}
            className="event-input-jg event-datepicker-jg event-left-input-jg"
            onChange={(selectedDates, dateString, instance) => {
              console.log(
                "[Dashboard.jsx] reminderDate onChange:",
                selectedDates,
                dateString,
                instance
              );
              handleInputChange({
                target: {
                  name: "reminderDate",
                  value: dateString,
                },
              });
            }}
          />
        </div>
        <div className="event-half-length-label-input-jg">
          <p className="event-details-label-jg event-middle-label-jg">
            Reminder Time
          </p>
          <Flatpickr
            name="reminderTime"
            value={formData.reminderTime || ""}
            className="event-input-jg event-datepicker-jg event-middle-input-jg"
            options={{
              noCalendar: true,
              enableTime: true,
              allowInput: true,
              dateFormat: "h:i K",
              closeOnSelect: true,
              clickOpens: true,
              minuteIncrement: 30,
            }}
            onChange={(selectedDates, dateString, instance) => {
              console.log(
                "[Dashboard.jsx] reminderTime onChange:",
                selectedDates,
                dateString,
                instance
              );
              handleInputChange({
                target: {
                  name: "reminderTime",
                  value: dateString,
                },
              });
            }}
          />
        </div>
      </div>
    </form>
  );
}
