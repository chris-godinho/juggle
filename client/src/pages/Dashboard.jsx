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
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const localDate = new Date();
  const midnightLocalDate = new Date(localDate);
  midnightLocalDate.setHours(0, 0, 0, 0);
  const timeZoneOffset = localDate.getTimezoneOffset();
  const utcMiliseconds = localDate.getTime() + timeZoneOffset * 60 * 1000;
  const currentDate = new Date(utcMiliseconds);
  console.log("[Dashboard.jsx] localDate:", localDate);
  console.log("[Dashboard.jsx] timeZoneOffset:", timeZoneOffset);
  console.log("[Dashboard.jsx] currentDate (UTC):", currentDate);
  const [selectedDate, setSelectedDate] = useState(midnightLocalDate);

  const userProfile = AuthService.getProfile();
  console.log("[Dashboard.jsx] userProfile:", userProfile);
  const userId = userProfile.data._id;

  const [addEvent, { error, data }] = useMutation(ADD_EVENT);

  // Add a state to track a refetch flag
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleRefetch = () => {
    // Toggle the refetch flag
    setShouldRefetch(!shouldRefetch);
  };

  const logout = (event) => {
    // Log user out and return them to welcome page
    event.preventDefault();
    Auth.logout();
    window.location.href = "/";
  };

  const selectPreviousDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const selectNextDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };

  // Set up modal window
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const handleModalClose = async (choice, formData) => {
    console.log("[Dashboard.jsx] choice:", choice); // Handle the user's choice
    if (choice === "Submit") {
      console.log("[Dashboard.jsx] formData:", formData); // Access the form data

      // Combine startDate and startTime into eventStart
      const eventStartDate = formData.startDate;
      const eventStartTime = formData.startTime || "00:00";
      const eventStart = new Date(`${eventStartDate} ${eventStartTime}`);
      console.log("[Dashboard.jsx] eventStart:", eventStart);
      /*
      const convertedEventStart = eventStart.getTime() + timeZoneOffset * 60 * 1000;
      const utcEventStart = new Date(convertedEventStart);
      console.log("[Dashboard.jsx] utcEventStart:", utcEventStart);
      */

      // Combine endDate and endTime into eventEnd
      const eventEndDate = formData.endDate;
      const eventEndTime = formData.endTime || "00:00";
      const eventEnd = new Date(`${eventEndDate} ${eventEndTime}`);
      console.log("[Dashboard.jsx] eventEnd:", eventEnd);
      /*
      const convertedEventEnd = eventEnd.getTime() + timeZoneOffset * 60 * 1000;
      const utcEventEnd = new Date(convertedEventEnd);
      console.log("[Dashboard.jsx] utcEventEnd:", utcEventEnd);
      */

      // Create the final form data
      const finalFormData = {
        ...formData,
        eventStart,
        eventEnd,
      };

      console.log("[Dashboard.jsx] finalFormData:", finalFormData);

      // Add event to database
      try {
        const { data } = await addEvent({
          variables: { user: userId, ...finalFormData },
        });
        console.log("[Dashboard.jsx] data:", data);
        handleRefetch();
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
            <div className="selected-date-container-jg">
              <a href="#" onClick={selectPreviousDay}>
                <span className="material-symbols-outlined">
                  arrow_back_ios_new
                </span>
              </a>
              <div className="selected-date-box-jg">
                <h3>{`${
                  weekDays[selectedDate.getDay()]
                }, ${selectedDate.getDate()} ${
                  months[selectedDate.getMonth()]
                } ${selectedDate.getFullYear()}`}</h3>
              </div>
              <a href="#" onClick={selectNextDay}>
                <span className="material-symbols-outlined">
                  arrow_forward_ios
                </span>
              </a>
            </div>
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
          <Schedule
            key={selectedDate.getTime()}
            userId={userId}
            selectedDate={selectedDate}
            timeZoneOffset={timeZoneOffset}
            shouldRefetch={shouldRefetch}
          />
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
