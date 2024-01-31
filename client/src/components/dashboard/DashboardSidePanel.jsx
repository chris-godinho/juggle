// DashboardSidePanel.jsx

import { useDataContext } from "../contextproviders/DataContext";

import LoadingSpinner from "../other/LoadingSpinner.jsx";
import SidePanelBrand from "./SidePanelBrand.jsx";
import SidePanelMenu from "./SidePanelMenu.jsx";
import SidePanelStats from "./SidePanelStats.jsx";
import SidePanelEvents from "./SidePanelEvents.jsx";
import SidePanelRecommendations from "./SidePanelRecommendations.jsx";
import DigitalClock from "./DigitalClock.jsx";

export default function DashboardSidePanel({ eventType }) {
  const sidePanelSpinnerStyle = {
    spinnerWidth: "16%",
    spinnerHeight: "95vh",
    spinnerElWidthHeight: "100px",
  };

  const {
    events,
    eventsLoading,
    userLoading,
    showStats,
    dashboardLayout,
  } = useDataContext();

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
              />
              <SidePanelRecommendations
                eventType={
                  dashboardLayout === "one-sidebar-left" ||
                  dashboardLayout === "one-sidebar-right"
                    ? "Life"
                    : eventType
                }
              />
            </div>
          </>
        )}
    </aside>
  );
}
