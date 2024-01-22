// Dashboard.jsx

import React, { useEffect, useState } from "react";

import { useModal } from "../components/ModalProvider.jsx";

import Schedule from "../components/Schedule";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import NewEvent from "../components/NewEvent.jsx";

import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_EVENTS_BY_DATE } from "../utils/queries.js";

import AuthService from "../utils/auth.js";
import { calculateEventStats } from "../utils/eventUtils.js";
import UserMenu from "../components/UserMenu.jsx";

export default function Dashboard() {
  // Set up date variables for display
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

  // Set up date variables for queries and new events
  const localDate = new Date();
  const midnightLocalDate = new Date(localDate);
  midnightLocalDate.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(midnightLocalDate);

  console.log("[Dashboard.jsx] selectedDate:", selectedDate);

  const { openModal } = useModal();

  useEffect(() => {
    eventsRefetch();
  }, [selectedDate]);

  // Get user profile
  const userProfile = AuthService.getProfile();
  const userId = userProfile.data._id;
  const username = userProfile.data.username;

  console.log("[Dashboard.jsx] userProfile:", userProfile);

  // Query events for the selected date
  const {
    loading: eventsLoading,
    data: eventsData,
    error: eventsError,
    refetch: eventsRefetch,
  } = useQuery(QUERY_EVENTS_BY_DATE, {
    variables: { user: userId, eventStart: selectedDate },
  });

  const {
    loading: subtypeLoading,
    data: subtypeData,
    error: subtypeError,
  } = useQuery(QUERY_USER, {
    variables: { username: userProfile.data.username },
  });

  if (eventsLoading || subtypeLoading) {
    return <LoadingSpinner />;
  }

  if (eventsError || subtypeError) {
    console.error("[Schedule.jsx] GraphQL Error:", error);
    return <div>Error fetching data.</div>;
  }

  const events = eventsData?.eventsByDate || [];

  console.log("[Schedule.jsx] events:", events);

  const { workCount, workTotalTime, lifeCount, lifeTotalTime } =
    calculateEventStats(events);

  const sleepingHours = 8 * 60;
  const totalAllottedTime = 24 * 60 - sleepingHours;
  let workPercentage;
  workTotalTime > 0
    ? (workPercentage = Math.round((workTotalTime / totalAllottedTime) * 100))
    : (workPercentage = 0);
  let lifePercentage;
  lifeTotalTime > 0
    ? (lifePercentage = Math.round((lifeTotalTime / totalAllottedTime) * 100))
    : (lifePercentage = 0);
  const unalottedTimePercentage = 100 - workPercentage - lifePercentage;

  // TODO: Make the workPercentage and lifePercentage values display in the side panels
  // TODO: Create a third percentage for unalotted time
  // TODO: Refine the stats to adapt to several options in Settings (unused variables: sleepingHours, totalAllottedTime, unalottedTimePercentage)

  console.log("[Dashboard.jsx] subtypeData:", subtypeData);

  const eventSubtypes = subtypeData?.user.eventSubtypes;

  const selectPreviousDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const selectNextDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };

  const handleNewEventModalClose = () => {
    eventsRefetch();
  };

  return (
    <main className="main-jg">
      <div className="dashboard-grid-jg">
        <div className="dashboard-side-panel-jg work-text-jg">
          <div className="side-panel-top-jg">
            <h3>Work</h3>
          </div>
          <div className="side-panel-middle-jg">
            <h1>{workPercentage}%</h1>
          </div>
          <div className="side-panel-bottom-jg">
            <p>of your waking hours</p>
          </div>
        </div>
        <div className="dashboard-main-panel-jg">
          <div className="dashboard-main-top-row-jg">
            <button
              className="round-button-jg work-border-jg"
              onClick={() =>
                openModal(
                  <UserMenu
                    username={username}
                    userId={userId}
                  />
                )
              }
            >
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
              onClick={() =>
                openModal(
                  <NewEvent
                    eventSubtypes={eventSubtypes}
                    handleNewEventModalClose={handleNewEventModalClose}
                    userId={userId}
                  />
                )
              }
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
            events={events}
            selectedDate={selectedDate}
          />
        </div>
        <div className="dashboard-side-panel-jg life-text-jg">
          <div className="side-panel-top-jg">
            <h3>Life</h3>
          </div>
          <div className="side-panel-middle-jg">
            <h1>{lifePercentage}%</h1>
          </div>
          <div className="side-panel-bottom-jg">
            <p>of your waking hours</p>
          </div>
        </div>
      </div>
    </main>
  );
}
