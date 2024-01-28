// NewEvent.jsx

import { useState } from "react";
import { useMutation } from "@apollo/client";

import { useModal } from "../contextproviders/ModalProvider";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

import { ADD_EVENT } from "../../utils/mutations";

const NewEvent = ({ eventSubtypes, handleNewEventModalClose, userId }) => {
  console.log("[NewEvent.jsx] Component is rendering");

  const [formData, setFormData] = useState({});

  // Set up GraphQL mutation for adding events
  const [addEvent, { error, data }] = useMutation(ADD_EVENT);

  const { closeModal } = useModal();

  const handleModalClose = async (choice) => {
    if (choice === "Submit") {
      // Combine startDate and startTime into eventStart
      const eventStartDate = formData.startDate;
      const eventStartTime = formData.startTime || "00:00";
      const eventStart = new Date(`${eventStartDate} ${eventStartTime}`);

      // Combine endDate and endTime into eventEnd
      const eventEndDate = formData.endDate;
      const eventEndTime = formData.endTime || "00:00";
      const eventEnd = new Date(`${eventEndDate} ${eventEndTime}`);

      // Create the final form data
      const finalFormData = {
        ...formData,
        eventStart,
        eventEnd,
      };

      // Add event to database
      try {
        const { data } = await addEvent({
          variables: { user: userId, ...finalFormData },
        });
        setFormData({});
        handleNewEventModalClose();
      } catch (e) {
        console.error(e);
      }
    }
    closeModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "subtype") {
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
  };

  return (
    <div className="modal-jg new-event-modal-container-jg">
      <form className="modal-content-jg">
        <a
          href="#"
          className="modal-close-button-jg"
          onClick={() => handleModalClose("Cancel", formData)}
        >
          <span className="material-symbols-outlined">close</span>
        </a>
        <h3>New Event</h3>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          className="modal-input-jg"
          placeholder="Title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="details"
          value={formData.details || ""}
          className="modal-input-jg"
          placeholder="Details"
          onChange={handleInputChange}
        />
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Start Date</p>
          <Flatpickr
            name="startDate"
            value={formData.startDate || ""}
            options={{
              dateFormat: "m/d/Y",
              allowInput: true,
              closeOnSelect: true,
              clickOpens: true,
            }}
            className="modal-datepicker-jg"
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
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Start Time</p>
          <Flatpickr
            name="startTime"
            value={formData.startTime || ""}
            className="modal-datepicker-jg"
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
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">End Date</p>
          <Flatpickr
            name="endDate"
            value={formData.endDate || ""}
            className="modal-datepicker-jg"
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
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">End Time</p>
          <Flatpickr
            name="endTime"
            value={formData.endTime || ""}
            className="modal-datepicker-jg"
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
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Category</p>
          <select
            className="modal-select-jg modal-halfsize-jg modal-halfsize-left-jg"
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
          <p className="modal-datepicker-select-label-jg">Type</p>
          <select
            className="modal-select-jg modal-halfsize-jg"
            name="type"
            value={formData.type || ""}
            onChange={handleInputChange}
          >
            <option value=""></option>
            <option value="work">Work</option>
            <option value="life">Life</option>
          </select>
        </div>
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          className="modal-input-jg"
          placeholder="Location"
          onChange={handleInputChange}
        />
      </form>
      <div className="modal-button-tray-jg">
        <button
          className="button-jg modal-button-jg"
          onClick={() => handleModalClose("Submit", formData)}
        >
          Submit
        </button>
        <button
          className="button-jg modal-button-jg"
          onClick={() => handleModalClose("Cancel", formData)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewEvent;
