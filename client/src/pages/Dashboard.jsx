// Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { useModal } from "../components/ModalProvider.jsx";

import Schedule from "../components/Schedule";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import NewEvent from "../components/NewEvent.jsx";
import UserMenu from "../components/UserMenu.jsx";

import { QUERY_USER, QUERY_EVENTS_BY_DATE } from "../utils/queries.js";

import AuthService from "../utils/auth.js";
import { calculateEventStats } from "../utils/eventUtils.js";
import SidePanelStats from "../components/SidePanelStats.jsx";
import SidePanelEvents from "../components/SidePanelEvents.jsx";
import SidePanelRecommendations from "../components/SidePanelRecommendations.jsx";

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

  useEffect(() => {
    eventsRefetch();
  }, [selectedDate]);

  const { openModal } = useModal();

  // Get user profile
  const userProfile = AuthService.getProfile();
  const userId = userProfile.data._id;
  const username = userProfile.data.username;

  console.log("[Dashboard.jsx] userProfile:", userProfile);

  const sidePanelSpinnerStyle = {
    spinnerWidth: "16%",
    spinnerHeight: "95vh",
    spinnerElWidthHeight: "100px",
  };

  const scheduleSpinnerStyle = {
    spinnerWidth: "100%",
    spinnerHeight: "80vh",
    spinnerElWidthHeight: "100px",
  };

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
    loading: userLoading,
    data: userData,
    error: userError,
  } = useQuery(QUERY_USER, {
    variables: { username: userProfile.data.username },
  });

  if (eventsError || userError) {
    console.error("[Schedule.jsx] GraphQL Error:", error);
    return <div>Error fetching data.</div>;
  }

  const events = eventsData?.eventsByDate || [];

  console.log("[Schedule.jsx] events:", events);

  const { eventCount, totalAlottedTime, unalottedTimePercentage } =
    calculateEventStats(events);

  console.log("[Dashboard.jsx] userData:", userData);

  const eventSubtypes = userData?.user.eventSubtypes;

  const selectPreviousDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const selectNextDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };

  const handleNewEventModalClose = () => {
    eventsRefetch();
  };

  const hasMatchingWorkEvents = events.some(
    (event) => "work" === event.type.toLowerCase()
  );

  const hasMatchingLifeEvents = events.some(
    (event) => "life" === event.type.toLowerCase()
  );

  return (
    <main className="main-jg">
      <div className="dashboard-grid-jg">
        <div className="dashboard-side-panel-jg work-text-jg">
          {eventsLoading || userLoading ? (
            <LoadingSpinner
              spinnerStyle={sidePanelSpinnerStyle}
              spinnerElWidthHeight="100px"
            />
          ) : (
            <>
              <SidePanelStats events={events} eventType="Work" />
              {hasMatchingWorkEvents && (
                <>
                  <hr className="side-panel-hr-jg work-hr-jg" />
                  <SidePanelEvents
                    events={events}
                    eventType="Work"
                    eventCount={eventCount}
                    totalAlottedTime={totalAlottedTime}
                  />
                </>
              )}
              <SidePanelRecommendations eventType="Work" />
            </>
          )}
        </div>
        <div className="dashboard-main-panel-jg">
          <div className="dashboard-main-top-row-jg">
            <button
              className="round-button-jg work-border-jg"
              onClick={() =>
                openModal(<UserMenu username={username} userId={userId} />)
              }
            >
              <img
                className="dashboard-profile-picture-jg"
                src="/test-prof-pic.jpg"
                alt="profile picture"
              />
            </button>
            <div className="date-percentage-container-jg">
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
              <div className="unalotted-percentage-jg">
                <p>
                  Unalotted Time: {unalottedTimePercentage}%
                </p>
              </div>
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
              <svg
                className="add-event-picture-jg"
                xmlns="http://www.w3.org/2000/svg"
                width="512"
                height="512"
                viewBox="0 0 512 512"
                version="1.1"
              >
                <path d="" stroke="none" fillRule="evenodd" />
                <path
                  d="M 242.184 209.500 L 242.629 243 205.314 243 L 168 243 168 255.500 L 168 268 205.500 268 L 243 268 243 301.500 L 243 335 256 335 L 269 335 269 301.500 L 269 268 306.500 268 L 344 268 344 255.500 L 344 243 306.686 243 L 269.371 243 269.816 209.500 L 270.260 176 256 176 L 241.740 176 242.184 209.500"
                  stroke="none"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {eventsLoading || userLoading ? (
            <LoadingSpinner
              spinnerStyle={scheduleSpinnerStyle}
              spinnerElWidthHeight="100px"
            />
          ) : (
            <Schedule
              key={selectedDate.getTime()}
              events={events}
              selectedDate={selectedDate}
              eventSubtypes={eventSubtypes}
              eventsRefetch={eventsRefetch}
            />
          )}
        </div>
        {eventsLoading || userLoading ? (
          <LoadingSpinner
            spinnerStyle={sidePanelSpinnerStyle}
            spinnerElWidthHeight="100px"
          />
        ) : (
          <>
            <div className="dashboard-side-panel-jg life-text-jg">
              <SidePanelStats events={events} eventType="Life" />
              {hasMatchingLifeEvents && (
                <>
                  <hr className="side-panel-hr-jg life-hr-jg" />
                  <SidePanelEvents
                    events={events}
                    eventType="Life"
                    eventCount={eventCount}
                    totalAlottedTime={totalAlottedTime}
                  />
                </>
              )}
              <SidePanelRecommendations eventType="Life" />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
