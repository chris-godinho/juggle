import React, { useState } from "react";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

import PopUpModal from "../components/PopUpModal";
import Schedule from "../components/Schedule";

import Auth from "../utils/auth";

export default function Dashboard() {
  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const openModal = () => {
    setModalOpen(true);
  };

  const handleModalClose = (choice, formData) => {
    console.log(choice); // Handle the user's choice
    if (choice === "Submit") {
      console.log(formData); // Access the form data
      setModalOpen(false);
    } else {
      setModalOpen(false);
    }
  };

  const customFormModalConfig = {
    content: (handleInputChange) => (
      <form className="modal-form-jg">
        <h3>New Event</h3>
        <input
          type="text"
          name="title"
          className="modal-input-jg"
          placeholder="Title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="details"
          className="modal-input-jg"
          placeholder="Details"
          onChange={handleInputChange}
        />
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Start Date</p>
          <Flatpickr
            className="modal-datepicker-jg"
            data-date-format="m/d/Y"
            data-allow-input={true}
            value={startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Start Time</p>
          <Flatpickr
            className="modal-datepicker-jg"
            data-no-calendar
            data-enable-time
            data-allow-input={true}
            value={startTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">End Date</p>
          <Flatpickr
            className="modal-datepicker-jg"
            data-date-format="m/d/Y"
            data-allow-input={true}
            value={endDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">End Time</p>
          <Flatpickr
            className="modal-datepicker-jg"
            data-no-calendar
            data-enable-time
            data-allow-input={true}
            value={endTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Event Type</p>
          <select
            className="modal-select-jg"
            name="role"
            onChange={handleInputChange}
          >
            <option value="work">Work</option>
            <option value="life">Life</option>
          </select>
        </div>
        <input
          type="text"
          name="location"
          className="modal-input-jg"
          placeholder="Location"
          onChange={handleInputChange}
        />
      </form>
    ),
    buttons: [
      { label: "Submit", onClick: () => handleModalClose("Submit", formData) },
      { label: "Cancel", onClick: () => handleModalClose("Cancel", formData) },
    ],
  };

  return (
    <main className="main-jg">
      <div className="dashboard-grid-jg">
        <div className="dashboard-side-panel-jg work-side-jg">
          <div className="side-panel-top-jg">
            <h3>Work</h3>
          </div>
          <div className="side-panel-middle-jg">
            <h1>50%</h1>
          </div>
          <div className="side-panel-bottom-jg">
            <p>of your day</p>
          </div>
        </div>
        <div className="dashboard-main-panel-jg">
          <div className="dashboard-main-top-row-jg">
            <button className="round-button-jg work-border-jg" onClick={logout}>
              <img
                className="dashboard-profile-picture-jg"
                src="/test-prof-pic.jpg"
                alt="profile picture"
              />
            </button>
            <h3>Today</h3>
            <button
              className="round-button-jg life-border-jg"
              onClick={openModal}
            >
              <img
                className="add-event-picture-jg"
                src="/plus_sign.png"
                alt="profile picture"
              />
            </button>
          </div>
          <Schedule />
        </div>
        <div className="dashboard-side-panel-jg life-side-jg">
          <div className="side-panel-top-jg">
            <h3>Life</h3>
          </div>
          <div className="side-panel-middle-jg">
            <h1>50%</h1>
          </div>
          <div className="side-panel-bottom-jg">
            <p>of your day</p>
          </div>
        </div>
      </div>
      <PopUpModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        modalConfig={customFormModalConfig}
      />
    </main>
  );
}
