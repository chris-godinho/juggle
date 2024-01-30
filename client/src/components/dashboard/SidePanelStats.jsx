// SidePanelStats.jsx

import React, { useState, useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import {
  findDisplayPercentage,
  findDisplayText,
} from "../../utils/eventUtils.js";

export default function SidePanelStats({
  eventType,
  workPercentage,
  lifePercentage,
  workPercentageWithSleepingHours,
  lifePercentageWithSleepingHours,
  workPercentageIgnoreUnalotted,
  lifePercentageIgnoreUnalotted,
}) {
  const { events } = useDataContext();

  const { userSettings, isLoadingSettings } = useUserSettings();

  const localStorageLayout = localStorage.getItem("layout");

  const [percentageBasis, setPercentageBasis] = useState("waking");
  const [ignoreUnalotted, setIgnoreUnalotted] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState(
    localStorageLayout || "two-sidebars"
  );

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      setPercentageBasis(
        userSettings.statSettings?.percentageBasis ?? "waking"
      );
      setIgnoreUnalotted(userSettings.statSettings?.ignoreUnalotted ?? false);
      setDashboardLayout(
        userSettings?.layoutSettings?.dashboardLayout ??
          localStorageLayout ??
          "two-sidebars"
      );
    }
  }, [userSettings, isLoadingSettings]);

  const displayPercentage = findDisplayPercentage(
    eventType,
    ignoreUnalotted,
    percentageBasis,
    workPercentage,
    workPercentageIgnoreUnalotted,
    workPercentageWithSleepingHours,
    lifePercentage,
    lifePercentageIgnoreUnalotted,
    lifePercentageWithSleepingHours
  );

  const displayText = findDisplayText(ignoreUnalotted, percentageBasis);

  return (
    <>
      <div
        className={`side-panel-top-jg ${
          dashboardLayout === "one-sidebar-left" ||
          dashboardLayout === "one-sidebar-right"
            ? "side-panel-stats-top-one-sidebar-jg"
            : ""
        }`}
      >
        <p
          className={`side-panel-stats-title-jg ${
            dashboardLayout === "one-sidebar-left" ||
            dashboardLayout === "one-sidebar-right"
              ? "side-panel-stats-title-one-sidebar-jg"
              : ""
          }`}
        >
          {eventType}
        </p>
      </div>
      <div
        className={`side-panel-middle-jg ${
          dashboardLayout === "one-sidebar-left" ||
          dashboardLayout === "one-sidebar-right"
            ? "side-panel-stats-middle-one-sidebar-jg"
            : ""
        }`}
      >
        <h1>{displayPercentage}%</h1>
      </div>
      <div className={`side-panel-bottom-jg ${
          dashboardLayout === "one-sidebar-left" ||
          dashboardLayout === "one-sidebar-right"
            ? "side-panel-stats-bottom-one-sidebar-jg"
            : ""
        }`}>
        <p>{displayText}</p>
      </div>
    </>
  );
}
