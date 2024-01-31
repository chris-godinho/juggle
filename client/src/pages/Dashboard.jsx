// Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import DataContext from "../components/contextproviders/DataContext.jsx";
import { useUserSettings } from "../components/contextproviders/UserSettingsProvider.jsx";

import Schedule from "../components/dashboard/Schedule";
import LoadingSpinner from "../components/other/LoadingSpinner.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import DashboardSidePanel from "../components/dashboard/DashboardSidePanel.jsx";

import { QUERY_EVENTS_BY_DATE } from "../utils/queries.js";

import { calculateEventStats } from "../utils/eventUtils.js";
import AuthService from "../utils/auth.js";

export default function Dashboard() {
  const { userSettings, isLoadingSettings } = useUserSettings();

  const localStorageLayout = localStorage.getItem("layout");

  // Set up date variables for queries and new events
  const localDate = new Date();
  const midnightLocalDate = new Date(localDate);
  midnightLocalDate.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(midnightLocalDate);

  // Get user profile
  const userProfile = AuthService.getProfile();

  const [username, setUsername] = useState(userProfile?.data?.username || "");
  const [userId, setUserId] = useState(userProfile?.data?._id || "");
  const [showStats, setShowStats] = useState(true);
  const [percentageBasis, setPercentageBasis] = useState("waking");
  const [ignoreUnalotted, setIgnoreUnalotted] = useState(false);
  const [eventSubtypes, setEventSubtypes] = useState([]);
  const [dashboardLayout, setDashboardLayout] = useState(
    localStorageLayout || "two-sidebars"
  );
  const [workPreferredActivities, setWorkPreferredActivities] = useState([]);
  const [lifePreferredActivities, setLifePreferredActivities] = useState([]);
  const [balanceGoal, setBalanceGoal] = useState(0);

  const [fetchedSettings, setFetchedSettings] = useState({});

  const [eventCount, setEventCount] = useState(0);
  const [totalAlottedTime, setTotalAlottedTime] = useState(0);
  const [totalAlottedTimeWithSleepingHours, setTotalAlottedTimeWithSleepingHours] = useState(0);
  const [totalAlottedTimeIgnoreUnalotted, setTotalAlottedTimeIgnoreUnalotted] = useState(0);
  const [unalottedTimePercentage, setUnalottedTimePercentage] = useState(0);
  const [unalottedTimePercentageWithSleepingHours, setUnalottedTimePercentageWithSleepingHours] = useState(0);
  const [workCount, setWorkCount] = useState(0);
  const [workTotalTime, setWorkTotalTime] = useState(0);
  const [workPercentage, setWorkPercentage] = useState(0);
  const [workPercentageWithSleepingHours, setWorkPercentageWithSleepingHours] = useState(0);
  const [workPercentageIgnoreUnalotted, setWorkPercentageIgnoreUnalotted] = useState(0);
  const [lifeCount, setLifeCount] = useState(0);
  const [lifeTotalTime, setLifeTotalTime] = useState(0);
  const [lifePercentage, setLifePercentage] = useState(0);
  const [lifePercentageWithSleepingHours, setLifePercentageWithSleepingHours] = useState(0);
  const [lifePercentageIgnoreUnalotted, setLifePercentageIgnoreUnalotted] = useState(0);

  const [fetchedEventData, setFetchedEventData] = useState({});

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

  const events = eventsData?.eventsByDate || [];

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      setUsername(userProfile?.data?.username || "");
      setUserId(userProfile?.data?._id || "");
      setShowStats(userSettings.statSettings?.showStats ?? true);
      setPercentageBasis(
        userSettings.statSettings?.percentageBasis ?? "waking"
      );
      setIgnoreUnalotted(userSettings.statSettings?.ignoreUnalotted ?? false);
      setEventSubtypes(userSettings.eventSubtypes ?? []);
      setDashboardLayout(
        userSettings?.layoutSettings?.dashboardLayout ??
          localStorageLayout ??
          "two-sidebars"
      );
      setWorkPreferredActivities(userSettings.workPreferredActivities ?? []);
      setLifePreferredActivities(userSettings.lifePreferredActivities ?? []);
      setBalanceGoal(userSettings.balanceGoal ?? 0);
    }
  }, [userSettings, isLoadingSettings]);

  useEffect(() => {
    if (!eventsLoading) {
      try {
        // Fetch data or perform any necessary asynchronous operation
        const result = calculateEventStats(events);

        // Destructure and set state variables with the same names
        const {
          eventCount,
          totalAlottedTime,
          totalAlottedTimeWithSleepingHours,
          totalAlottedTimeIgnoreUnalotted,
          unalottedTimePercentage,
          unalottedTimePercentageWithSleepingHours,
          workCount,
          workTotalTime,
          workPercentage,
          workPercentageWithSleepingHours,
          workPercentageIgnoreUnalotted,
          lifeCount,
          lifeTotalTime,
          lifePercentage,
          lifePercentageWithSleepingHours,
          lifePercentageIgnoreUnalotted,
        } = result;

        // Set state variables with the same names
        setEventCount(eventCount);
        setTotalAlottedTime(totalAlottedTime);
        setTotalAlottedTimeWithSleepingHours(totalAlottedTimeWithSleepingHours);
        setTotalAlottedTimeIgnoreUnalotted(totalAlottedTimeIgnoreUnalotted);
        setUnalottedTimePercentage(unalottedTimePercentage);
        setUnalottedTimePercentageWithSleepingHours(unalottedTimePercentageWithSleepingHours);
        setWorkCount(workCount);
        setWorkTotalTime(workTotalTime);
        setWorkPercentage(workPercentage);
        setWorkPercentageWithSleepingHours(workPercentageWithSleepingHours);
        setWorkPercentageIgnoreUnalotted(workPercentageIgnoreUnalotted);
        setLifeCount(lifeCount);
        setLifeTotalTime(lifeTotalTime);
        setLifePercentage(lifePercentage);
        setLifePercentageWithSleepingHours(lifePercentageWithSleepingHours);
        setLifePercentageIgnoreUnalotted(lifePercentageIgnoreUnalotted);
      } catch (error) {
        // Handle errors
        console.error('Error fetching data:', error);
      }
    }
  }, [events, eventsLoading]);

  useEffect(() => {
    eventsRefetch();
  }, [selectedDate]);

  return (
    <DataContext.Provider
      value={{
        username,
        userId,
        events,
        eventSubtypes,
        selectedDate,
        setSelectedDate,
        eventsLoading,
        eventsRefetch,
        showStats,
        percentageBasis,
        ignoreUnalotted,
        dashboardLayout,
        workPreferredActivities,
        lifePreferredActivities,
        balanceGoal,
        scheduleSpinnerStyle,
        eventCount,
        totalAlottedTime,
        totalAlottedTimeWithSleepingHours,
        totalAlottedTimeIgnoreUnalotted,
        unalottedTimePercentage,
        unalottedTimePercentageWithSleepingHours,
        workCount,
        workTotalTime,
        workPercentage,
        workPercentageWithSleepingHours,
        workPercentageIgnoreUnalotted,
        lifeCount,
        lifeTotalTime,
        lifePercentage,
        lifePercentageWithSleepingHours,
        lifePercentageIgnoreUnalotted,
      }}
    >
      <DashboardHeader />
      <main className="main-jg">
        <div className="dashboard-grid-jg">
          {(dashboardLayout === "two-sidebars" ||
            dashboardLayout === "one-sidebar-left") && (
            <DashboardSidePanel eventType="Work" />
          )}

          <div
            className={`dashboard-main-panel-jg ${
              (dashboardLayout === "one-sidebar-left" ||
                dashboardLayout === "no-sidebars") &&
              "dashboard-main-one-sidebar-left-jg"
            } ${
              (dashboardLayout === "one-sidebar-right" ||
                dashboardLayout === "no-sidebars") &&
              "dashboard-main-one-sidebar-right-jg"
            }`}
          >
            <div className="schedule-grid-container-jg">
              {eventsLoading ? (
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
                  scheduleSpinnerStyle={scheduleSpinnerStyle}
                />
              )}
            </div>
          </div>
          {(dashboardLayout === "two-sidebars" ||
            dashboardLayout === "one-sidebar-right") && (
            <DashboardSidePanel eventType="Life" />
          )}
        </div>
      </main>
    </DataContext.Provider>
  );
}
