import React, { useState } from "react";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

import PopUpModal from "../components/PopUpModal";
import Schedule from "../components/Schedule";

import { useMutation } from "@apollo/client";
import { ADD_EVENT } from "../utils/mutations";

import Auth from "../utils/auth";
import AuthService from "../utils/auth.js";

export default function Dashboard() {

  const userProfile = AuthService.getProfile();
  const userId = userProfile.data._id;

  const [addEvent, { error, data }] = useMutation(ADD_EVENT);

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  // Set up modal window
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const handleModalClose = async (choice, formData) => {
    console.log(choice); // Handle the user's choice
    if (choice === "Submit") {
      console.log("formData:", formData); // Access the form data
      // Add event to database
      try {
        const { data } = await addEvent({
          variables: { user: userId, ...formData },
        });
        console.log("data:", data);
      } catch (e) {
        console.error(e);
      }
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
            name="startDate"
            options={{ dateFormat: "m/d/Y", allowInput: true }}
            className="modal-datepicker-jg"
            onChange={(selectedDates, dateString, instance) => {
              console.log("startDate onChange:", selectedDates, dateString, instance);
              handleInputChange({
                target: {
                  name: "startDate",
                  value: dateString
                }
              });
            }}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Start Time</p>
          <Flatpickr
            name="startTime"
            className="modal-datepicker-jg"
            options={{ noCalendar: true, enableTime: true, allowInput: true, dateFormat: "h:i K" }}
            onChange={(selectedDates, dateString, instance) => {
              console.log("startTime onChange:", selectedDates, dateString, instance);
              handleInputChange({
                target: {
                  name: "startTime",
                  value: dateString
                }
              });
            }}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">End Date</p>
          <Flatpickr
            name="endDate"
            className="modal-datepicker-jg"
            options={{ dateFormat: "m/d/Y", allowInput: true }}
            onChange={(selectedDates, dateString, instance) => {
              console.log("endDate onChange:", selectedDates, dateString, instance);
              handleInputChange({
                target: {
                  name: "endDate",
                  value: dateString
                }
              });
            }}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">End Time</p>
          <Flatpickr
            name="endTime"
            className="modal-datepicker-jg"
            options={{ noCalendar: true, enableTime: true, allowInput: true, dateFormat: "h:i K" }}
            onChange={(selectedDates, dateString, instance) => {
              console.log("endTime onChange:", selectedDates, dateString, instance);
              handleInputChange({
                target: {
                  name: "endTime",
                  value: dateString
                }
              });
            }}
          />
        </div>
        <div className="modal-datepicker-select-tray-jg">
          <p className="modal-datepicker-select-label-jg">Event Type</p>
          <select
            className="modal-select-jg"
            name="type"
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
