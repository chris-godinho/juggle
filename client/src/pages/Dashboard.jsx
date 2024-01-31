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

  const [fetchedSettings, setFetchedSettings] = useState({
    username: userProfile?.data?.username || "",
    userId: userProfile?.data?._id || "",
    statSettings: {
      showStats: true,
      balanceGoal: 50,
      percentageBasis: "waking",
      ignoreUnalotted: false,
    },
    eventSubtypes: {},
    workPreferredActivities: {},
    lifePreferredActivities: {},
    layoutSettings: {
      dashboardLayout: localStorageLayout || "two-sidebars",
    },
  });

  const [fetchedEventData, setFetchedEventData] = useState({
    eventCount: 0,
    totalAlottedTime: 0,
    totalAlottedTimeWithSleepingHours: 0,
    totalAlottedTimeIgnoreUnalotted: 0,
    unalottedTimePercentage: 0,
    unalottedTimePercentageWithSleepingHours: 0,
    workCount: 0,
    workTotalTime: 0,
    workPercentage: 0,
    workPercentageWithSleepingHours: 0,
    workPercentageIgnoreUnalotted: 0,
    lifeCount: 0,
    lifeTotalTime: 0,
    lifePercentage: 0,
    lifePercentageWithSleepingHours: 0,
    lifePercentageIgnoreUnalotted: 0,
  });

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
    variables: { user: fetchedSettings.userId, eventStart: selectedDate },
  });

  const events = eventsData?.eventsByDate || [];

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      console.log("userSettings:", userSettings);
      setFetchedSettings({
        username: userSettings?.username || "",
        userId: userSettings?._id || "",
        statSettings: {
          showStats: userSettings?.statSettings?.showStats || true,
          balanceGoal: userSettings?.statSettings?.balanceGoal || 50,
          percentageBasis:
            userSettings?.statSettings?.percentageBasis || "waking",
          ignoreUnalotted: userSettings?.statSettings?.ignoreUnalotted || false,
        },
        eventSubtypes: userSettings?.eventSubtypes || {},
        workPreferredActivities: userSettings?.workPreferredActivities || {},
        lifePreferredActivities: userSettings?.lifePreferredActivities || {},
        layoutSettings: {
          dashboardLayout: userSettings?.layoutSettings?.dashboardLayout || "",
        },
      });
      console.log("fetchedSettings:", fetchedSettings);
    }
  }, [userSettings, isLoadingSettings]);

  useEffect(() => {
    if (!eventsLoading) {
      try {
        // Fetch data or perform any necessary asynchronous operation
        const result = calculateEventStats(events);
        console.log("result:", result);
        // Set state variables with the same names
        setFetchedEventData(result);
        console.log("fetchedEventData:", fetchedEventData);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    }
  }, [events, eventsLoading]);

  useEffect(() => {
    eventsRefetch();
  }, [selectedDate]);

  return (
    <DataContext.Provider
      value={{
        isLoadingSettings,
        selectedDate,
        setSelectedDate,
        scheduleSpinnerStyle,
        eventsLoading,
        eventsRefetch,
        events,
        fetchedSettings,
        fetchedEventData,
      }}
    >
      <DashboardHeader />
      <main className="main-jg">
        <div className="dashboard-grid-jg">
          {(fetchedSettings?.layoutSettings?.dashboardLayout ===
            "two-sidebars" ||
            fetchedSettings?.layoutSettings?.dashboardLayout ===
              "one-sidebar-left") && <DashboardSidePanel eventType="Work" />}

          <div
            className={`dashboard-main-panel-jg ${
              (fetchedSettings?.layoutSettings?.dashboardLayout ===
                "one-sidebar-left" ||
                fetchedSettings?.layoutSettings?.dashboardLayout ===
                  "no-sidebars") &&
              "dashboard-main-one-sidebar-left-jg"
            } ${
              (fetchedSettings?.layoutSettings?.dashboardLayout ===
                "one-sidebar-right" ||
                fetchedSettings?.layoutSettings?.dashboardLayout ===
                  "no-sidebars") &&
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
                  eventSubtypes={fetchedSettings?.eventSubtypes}
                  eventsRefetch={eventsRefetch}
                  scheduleSpinnerStyle={scheduleSpinnerStyle}
                />
              )}
            </div>
          </div>
          {(fetchedSettings?.layoutSettings?.dashboardLayout ===
            "two-sidebars" ||
            fetchedSettings?.layoutSettings?.dashboardLayout ===
              "one-sidebar-right") && <DashboardSidePanel eventType="Life" />}
        </div>
      </main>
    </DataContext.Provider>
  );
}
