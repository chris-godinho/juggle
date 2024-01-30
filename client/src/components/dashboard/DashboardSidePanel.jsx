// DashboardSidePanel.jsx

import React, { useState, useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { calculateEventStats } from "../../utils/eventUtils.js";

import LoadingSpinner from "../other/LoadingSpinner.jsx";
import SidePanelBrand from "./SidePanelBrand.jsx";
import SidePanelMenu from "./SidePanelMenu.jsx";
import SidePanelStats from "./SidePanelStats.jsx";
import SidePanelEvents from "./SidePanelEvents.jsx";
import SidePanelRecommendations from "./SidePanelRecommendations.jsx";
import DigitalClock from "./DigitalClock.jsx";

export default function DashboardSidePanel({ eventType }) {
  const { userSettings, isLoadingSettings } = useUserSettings();

  const localStorageLayout = localStorage.getItem("layout");

  const [showStats, setShowStats] = useState(true);
  const [dashboardLayout, setDashboardLayout] = useState(
    localStorageLayout || "two-sidebars"
  );

  console.log("[DashboardSidePanel.jsx] userSettings: ", userSettings);
  console.log(
    "[DashboardSidePanel.jsx] userSettings.statSettings: ",
    userSettings.statSettings
  );
  console.log("[DashboardSidePanel.jsx] showStats: ", showStats);

  const sidePanelSpinnerStyle = {
    spinnerWidth: "16%",
    spinnerHeight: "95vh",
    spinnerElWidthHeight: "100px",
  };

  const { events, eventsLoading, userLoading } = useDataContext();

  const {
    eventCount,
    totalAlottedTime,
    totalAlottedTimeWithSleepingHours,
    totalAlottedTimeIgnoreUnalotted,
    workPercentage,
    lifePercentage,
    workPercentageWithSleepingHours,
    lifePercentageWithSleepingHours,
    workPercentageIgnoreUnalotted,
    lifePercentageIgnoreUnalotted,
  } = calculateEventStats(events);

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      setShowStats(userSettings.statSettings?.showStats ?? true);
      setDashboardLayout(
        userSettings?.layoutSettings?.dashboardLayout ??
          localStorageLayout ??
          "two-sidebars"
      );
    }
  }, [userSettings, isLoadingSettings]);

  const hasMatchingWorkEvents = events.some(
    (event) => "work" === event.type.toLowerCase()
  );

  const hasMatchingLifeEvents = events.some(
    (event) => "life" === event.type.toLowerCase()
  );

  let hasMatchingEvents;
  if (eventType === "Work") {
    hasMatchingEvents = hasMatchingWorkEvents;
  } else {
    hasMatchingEvents = hasMatchingLifeEvents;
  }

  console.log(
    "[DashboardSidePanel.jsx] totalAlottedTimeWithSleepingHours: ",
    totalAlottedTimeWithSleepingHours
  );

  return (
    <aside
      className={`dashboard-side-panel-jg ${
        eventType === "Work"
          ? "work-text-jg work-sidebar-jg"
          : "life-text-jg life-sidebar-jg"
      }`}
    >
      <div
        className={`dashboard-side-panel-top-jg ${
          (dashboardLayout === "one-sidebar-left" ||
            dashboardLayout === "one-sidebar-right") &&
          showStats
            ? "dashboard-side-panel-single-top-jg work-text-jg"
            : ""
        }`}
      >
        {((!showStats && eventType === "Work") ||
          (!showStats && dashboardLayout === "one-sidebar-left") ||
          (!showStats && dashboardLayout === "one-sidebar-right")) && (
          <SidePanelBrand />
        )}
        {!showStats &&
          eventType === "Life" &&
          !(
            dashboardLayout === "one-sidebar-left" ||
            dashboardLayout === "one-sidebar-right"
          ) && (
            <>
              <DigitalClock />
            </>
          )}
        {!showStats && <hr className={`side-panel-hr-jg no-stats-hr-jg`} />}
        {!showStats && eventType === "Work" && <SidePanelMenu />}
        {eventsLoading || userLoading ? (
          <LoadingSpinner
            spinnerStyle={sidePanelSpinnerStyle}
            spinnerElWidthHeight="100px"
          />
        ) : (
          <>
            {showStats && (
              <SidePanelStats
                eventType={
                  dashboardLayout === "one-sidebar-left" ||
                  dashboardLayout === "one-sidebar-right"
                    ? "Work"
                    : eventType
                }
                workPercentage={workPercentage}
                lifePercentage={lifePercentage}
                workPercentageWithSleepingHours={
                  workPercentageWithSleepingHours
                }
                lifePercentageWithSleepingHours={
                  lifePercentageWithSleepingHours
                }
                workPercentageIgnoreUnalotted={workPercentageIgnoreUnalotted}
                lifePercentageIgnoreUnalotted={lifePercentageIgnoreUnalotted}
              />
            )}
            {(showStats &&
              !(dashboardLayout === "one-sidebar-left") &&
              !(dashboardLayout === "one-sidebar-right")) ||
              (!showStats && eventType === "Life" && (
                <SidePanelEvents
                  eventType={
                    dashboardLayout === "one-sidebar-left" ||
                    dashboardLayout === "one-sidebar-right"
                      ? "Work"
                      : eventType
                  }
                  hasMatchingEvents={hasMatchingEvents}
                  totalAlottedTime={totalAlottedTime}
                  totalAlottedTimeWithSleepingHours={
                    totalAlottedTimeWithSleepingHours
                  }
                  totalAlottedTimeIgnoreUnalotted={
                    totalAlottedTimeIgnoreUnalotted
                  }
                  showStats={showStats}
                />
              ))}

            {showStats && (
              <SidePanelRecommendations
                eventType={
                  dashboardLayout === "one-sidebar-left" ||
                  dashboardLayout === "one-sidebar-right"
                    ? "Work"
                    : eventType
                }
                workPercentage={workPercentage}
                lifePercentage={lifePercentage}
                workPercentageWithSleepingHours={
                  workPercentageWithSleepingHours
                }
                lifePercentageWithSleepingHours={
                  lifePercentageWithSleepingHours
                }
                workPercentageIgnoreUnalotted={workPercentageIgnoreUnalotted}
                lifePercentageIgnoreUnalotted={lifePercentageIgnoreUnalotted}
              />
            )}
          </>
        )}
      </div>
      {(dashboardLayout === "one-sidebar-left" ||
        dashboardLayout === "one-sidebar-right") &&
        showStats && (
          <>
            <hr className={`side-panel-hr-jg no-stats-hr-jg`} />
            <div
              className={`dashboard-side-panel-bottom-jg life-text-jg ${
                dashboardLayout === "one-sidebar-left" ||
                dashboardLayout === "one-sidebar-right"
                  ? "dashboard-side-panel-single-bottom-jg"
                  : ""
              }`}
            >
              <SidePanelStats
                eventType={
                  dashboardLayout === "one-sidebar-left" ||
                  dashboardLayout === "one-sidebar-right"
                    ? "Life"
                    : eventType
                }
                workPercentage={workPercentage}
                lifePercentage={lifePercentage}
                workPercentageWithSleepingHours={
                  workPercentageWithSleepingHours
                }
                lifePercentageWithSleepingHours={
                  lifePercentageWithSleepingHours
                }
                workPercentageIgnoreUnalotted={workPercentageIgnoreUnalotted}
                lifePercentageIgnoreUnalotted={lifePercentageIgnoreUnalotted}
              />
              <SidePanelRecommendations
                eventType={
                  dashboardLayout === "one-sidebar-left" ||
                  dashboardLayout === "one-sidebar-right"
                    ? "Life"
                    : eventType
                }
                workPercentage={workPercentage}
                lifePercentage={lifePercentage}
                workPercentageWithSleepingHours={
                  workPercentageWithSleepingHours
                }
                lifePercentageWithSleepingHours={
                  lifePercentageWithSleepingHours
                }
                workPercentageIgnoreUnalotted={workPercentageIgnoreUnalotted}
                lifePercentageIgnoreUnalotted={lifePercentageIgnoreUnalotted}
              />
            </div>
          </>
        )}
    </aside>
  );
}
