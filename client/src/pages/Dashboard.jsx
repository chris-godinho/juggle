// Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import DataContext from "../components/contextproviders/DataContext.jsx";
import { useUserSettings } from "../components/contextproviders/UserSettingsProvider.jsx";
import { useNotification } from "../components/contextproviders/NotificationProvider.jsx";

import Schedule from "../components/dashboard/Schedule";
import LoadingSpinner from "../components/other/LoadingSpinner.jsx";
import DashboardHeader from "../components/dashboard/DashboardHeader.jsx";
import DashboardSidePanel from "../components/dashboard/DashboardSidePanel.jsx";
import NotificationManager from "../components/dashboard/NotificationManager.jsx";

import { QUERY_EVENTS_BY_DATE } from "../utils/queries.js";

import { calculateEventStats } from "../utils/eventUtils.js";
import AuthService from "../utils/auth.js";

export default function Dashboard() {
  const { userSettings, isLoadingSettings } = useUserSettings();
  const { isNotificationOpen } = useNotification();

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
    showStats: true,
    balanceGoal: 50,
    percentageBasis: "waking",
    ignoreUnalotted: false,
    eventSubtypes: {},
    workPreferredActivities: {},
    lifePreferredActivities: {},
    dashboardLayout: localStorageLayout || "two-sidebars",
    profilePictureUrl: "/default-profile-picture.png",
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

  const [hasLeftSidebar, setHasLeftSidebar] = useState(true);
  const [hasRightSidebar, setHasRightSidebar] = useState(true);
  const [isOneBarLayout, setIsOneBarLayout] = useState(false);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 620);

  const scheduleSpinnerStyle = {
    spinnerWidth: "100%",
    spinnerHeight: "80vh",
    spinnerElWidthHeight: "100px",
  };

  // Query events for the selected date
  const {
    loading: eventsLoading,
    data: eventsData,
    refetch: eventsRefetch,
  } = useQuery(QUERY_EVENTS_BY_DATE, {
    variables: { user: fetchedSettings.userId, eventStart: selectedDate },
  });

  const events = eventsData?.eventsByDate || [];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 450);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // TODO: Remove this after testing
  useEffect(() => {
    console.log("[Dashboard.jsx] fetchedSettings:", fetchedSettings);
  }, [fetchedSettings]);

  // TODO: Remove this after testing
  useEffect(() => {
    console.log("[Dashboard.jsx] useEffect triggered, isNotificationOpen has been changed.");
  }, [isNotificationOpen]);

  useEffect(() => {
    if (!isLoadingSettings) {
      console.log(
        "[Dashboard.jsx] Data fetching is complete, updating state variables..."
      );
      console.log("[Dashboard.jsx] userSettings:", userSettings);
      setFetchedSettings({
        username: userSettings?.username || "",
        userId: userSettings?._id || "",
        showStats:
          userSettings?.statSettings?.showStats !== undefined
            ? userSettings?.statSettings?.showStats
            : true,
        balanceGoal: userSettings?.statSettings?.balanceGoal || 50,
        percentageBasis:
          userSettings?.statSettings?.percentageBasis || "waking",
        ignoreUnalotted:
          userSettings?.statSettings?.ignoreUnalotted !== undefined
            ? userSettings?.statSettings?.ignoreUnalotted
            : false,
        sleepingHours: userSettings?.sleepingHours || {},
        eventSubtypes: userSettings?.eventSubtypes || {},
        workPreferredActivities: userSettings?.workPreferredActivities || {},
        lifePreferredActivities: userSettings?.lifePreferredActivities || {},
        profilePictureUrl: userSettings?.profilePictureUrl || "/default-profile-picture.png",
      });
      const leftSidebar =
        userSettings?.layoutSettings?.dashboardLayout === "two-sidebars" ||
        userSettings?.layoutSettings?.dashboardLayout === "one-sidebar-left";
      const rightSidebar =
        userSettings?.layoutSettings?.dashboardLayout === "two-sidebars" ||
        userSettings?.layoutSettings?.dashboardLayout === "one-sidebar-right";
      const oneBarLayout =
        userSettings?.layoutSettings?.dashboardLayout === "one-sidebar-left" ||
        userSettings?.layoutSettings?.dashboardLayout === "one-sidebar-right";
      setHasLeftSidebar(leftSidebar);
      setHasRightSidebar(rightSidebar);
      setIsOneBarLayout(oneBarLayout);
    }
  }, [isLoadingSettings, userSettings]);

  useEffect(() => {
    if (!eventsLoading) {
      try {
        // Fetch data or perform any necessary asynchronous operation
        const result = calculateEventStats(events, fetchedSettings, selectedDate);
        console.log("[Dashboard.jsx] result:", result);
        // Set state variables with the same names
        setFetchedEventData(result);
        console.log("[Dashboard.jsx] fetchedEventData:", fetchedEventData);
      } catch (error) {
        // Handle errors
        console.error("[Dashboard.jsx] Error fetching data:", error);
      }
    }
  }, [events, eventsLoading, fetchedSettings, selectedDate]);

  useEffect(() => {
    eventsRefetch();
  }, [selectedDate]);

  return (
    <DataContext.Provider
      value={{
        isLoadingSettings,
        selectedDate,
        setSelectedDate,
        isOneBarLayout,
        hasLeftSidebar,
        hasRightSidebar,
        isMobileView,
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
          {hasLeftSidebar && <DashboardSidePanel sidebarToRender="left" />}

          <div
            className={`dashboard-main-panel-jg ${
              !hasRightSidebar ? "dashboard-main-one-sidebar-left-jg" : ""
            } ${!hasLeftSidebar ? "dashboard-main-one-sidebar-right-jg" : ""}`}
          >
            <div className="schedule-grid-container-jg">
              {eventsLoading ? (
                <LoadingSpinner
                  spinnerStyle={scheduleSpinnerStyle}
                  spinnerElWidthHeight="100px"
                />
              ) : (
                <Schedule key={selectedDate.getTime()} />
              )}
            </div>
          </div>
          {hasRightSidebar && <DashboardSidePanel sidebarToRender="right" />}
        </div>
      </main>
      <NotificationManager />
    </DataContext.Provider>
  );
}
