// SidePanelStats.jsx

import { useDataContext } from "../contextproviders/DataContext";

import {
  findDisplayPercentage,
  findDisplayText,
} from "../../utils/eventUtils.js";

export default function SidePanelStats({ eventType }) {
  const {
    eventsLoading,
    percentageBasis,
    ignoreUnalotted,
    dashboardLayout,
    workPercentage,
    lifePercentage,
    workPercentageWithSleepingHours,
    lifePercentageWithSleepingHours,
    workPercentageIgnoreUnalotted,
    lifePercentageIgnoreUnalotted,
  } = useDataContext();

  console.log("[SidePanelStats.jsx] percentageBasis: ", percentageBasis);
  console.log("[SidePanelStats.jsx] ignoreUnalotted: ", ignoreUnalotted);
  console.log("[SidePanelStats.jsx] dashboardLayout: ", dashboardLayout);
  console.log("[SidePanelStats.jsx] workPercentage: ", workPercentage);
  console.log("[SidePanelStats.jsx] lifePercentage: ", lifePercentage);
  console.log("[SidePanelStats.jsx] workPercentageWithSleepingHours: ", workPercentageWithSleepingHours);
  console.log("[SidePanelStats.jsx] lifePercentageWithSleepingHours: ", lifePercentageWithSleepingHours);
  console.log("[SidePanelStats.jsx] workPercentageIgnoreUnalotted: ", workPercentageIgnoreUnalotted);
  console.log("[SidePanelStats.jsx] lifePercentageIgnoreUnalotted: ", lifePercentageIgnoreUnalotted);

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
      <div
        className={`side-panel-bottom-jg ${
          dashboardLayout === "one-sidebar-left" ||
          dashboardLayout === "one-sidebar-right"
            ? "side-panel-stats-bottom-one-sidebar-jg"
            : ""
        }`}
      >
        <p>{displayText}</p>
      </div>
    </>
  );
}
