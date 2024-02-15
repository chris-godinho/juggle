// Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import DataContext from "../components/contextproviders/DataContext.jsx";
import { useUserSettings } from "../components/contextproviders/UserSettingsProvider.jsx";
import { useNotification } from "../components/contextproviders/NotificationProvider.jsx";

import Schedule from "../components/dashboard/Schedule";
import TaskList from "../components/dashboard/TaskList.jsx";
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
  const localStorageEventView = localStorage.getItem("eventView");

  console.log("[Dashboard.jsx] localStorageLayout:", localStorageLayout);
  console.log("[Dashboard.jsx] localStorageEventView:", localStorageEventView);

  // Set up date variables for queries and new events
  const localDate = new Date();
  const midnightLocalDate = new Date(localDate);
  midnightLocalDate.setHours(0, 0, 0, 0);
  const midnightTomorrowLocalDate = new Date(midnightLocalDate);
  midnightTomorrowLocalDate.setDate(midnightTomorrowLocalDate.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState(midnightLocalDate);
  const [tomorrowDate, setTomorrowDate] = useState(midnightTomorrowLocalDate);

  const [scheduleComponentRandomKey, setScheduleComponentRandomKey] = useState(
    Math.random()
  );

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
    viewStyle: localStorageEventView || "calendar",
    profilePictureUrl: null,
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
    workTaskPercentage: 0,
    workPercentageWithSleepingHours: 0,
    workPercentageIgnoreUnalotted: 0,
    lifeCount: 0,
    lifeTotalTime: 0,
    lifePercentage: 0,
    lifeTaskPercentage: 0,
    lifePercentageWithSleepingHours: 0,
    lifePercentageIgnoreUnalotted: 0,
  });

  const [hasLeftSidebar, setHasLeftSidebar] = useState(true);
  const [hasRightSidebar, setHasRightSidebar] = useState(true);
  const [isOneBarLayout, setIsOneBarLayout] = useState(false);

  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 620);

  const [responsiveGridTimestampKey, setResponsiveGridTimestampKey] = useState(
    Math.random()
  );

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
    variables: {
      user: fetchedSettings.userId,
      selectedDateStart: selectedDate,
      selectedDateEnd: tomorrowDate,
    },
  });

  const events = eventsData?.eventsByDate || [];

  const refreshResponsiveGrid = (refreshType = "change") => {
    console.log("refreshResponsiveGrid() called");
    setResponsiveGridTimestampKey(Math.random());
    if (refreshType === "change") {
      setScheduleComponentRandomKey(Math.random());
    }
    eventsRefetch();
  };

  useEffect(() => {
    console.log("[Dashboard.jsx] useEffect() - fetchedSettings has changed:", fetchedSettings);
    console.log("[Dashboard.jsx] useEffect() - fetchedSettings.viewStyle:", fetchedSettings.viewStyle);
  }, [fetchedSettings]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 450);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        profilePictureUrl: userSettings?.profilePictureUrl || null,
        viewStyle: userSettings?.layoutSettings?.viewStyle || "calendar",
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
        const result = calculateEventStats(
          events,
          fetchedSettings,
          selectedDate
        );
        // Set state variables with the same names
        setFetchedEventData(result);
      } catch (error) {
        // Handle errors
        console.error("[Dashboard.jsx] Error fetching data:", error);
      }
    }
  }, [events, eventsLoading, fetchedSettings, selectedDate]);

  useEffect(() => {
    console.log("[Dashboard.jsx] useEffect() - selectedDate has changed:", selectedDate);
    refreshResponsiveGrid("initial");
  }, [selectedDate]);

  return (
    <DataContext.Provider
      value={{
        isLoadingSettings,
        selectedDate,
        setSelectedDate,
        tomorrowDate,
        setTomorrowDate,
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
        responsiveGridTimestampKey,
        setResponsiveGridTimestampKey,
      }}
    >
      <DashboardHeader refreshResponsiveGrid={refreshResponsiveGrid} />
      <main className="main-jg">
        <div className="dashboard-grid-jg">
          {hasLeftSidebar && (
            <DashboardSidePanel
              sidebarToRender="left"
              refreshResponsiveGrid={refreshResponsiveGrid}
            />
          )}

          <div
            className={`dashboard-main-panel-jg ${
              !hasRightSidebar ? "dashboard-main-one-sidebar-left-jg" : ""
            } ${!hasLeftSidebar ? "dashboard-main-one-sidebar-right-jg" : ""}`}
          >
            <div className="schedule-grid-container-jg">
              {eventsLoading || isLoadingSettings ? (
                <LoadingSpinner
                  spinnerStyle={scheduleSpinnerStyle}
                  spinnerElWidthHeight="100px"
                />
              ) : fetchedSettings?.viewStyle === "calendar" ? (
                <Schedule
                  key={scheduleComponentRandomKey}
                  refreshResponsiveGrid={refreshResponsiveGrid}
                />
              ) : (
                <TaskList refreshResponsiveGrid={refreshResponsiveGrid} />
              )}
            </div>
          </div>
          {hasRightSidebar && (
            <DashboardSidePanel
              sidebarToRender="right"
              refreshResponsiveGrid={refreshResponsiveGrid}
            />
          )}
        </div>
      </main>
      <NotificationManager />
    </DataContext.Provider>
  );
}
