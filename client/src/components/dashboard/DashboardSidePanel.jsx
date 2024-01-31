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

  const { eventsLoading, events, fetchedSettings, isOneBarLayout } =
    useDataContext();

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
          isOneBarLayout && fetchedSettings?.layoutSettings?.showStats
            ? "dashboard-side-panel-single-top-jg work-text-jg"
            : ""
        }`}
      >
        {((!fetchedSettings?.layoutSettings?.showStats &&
          eventType === "Work") ||
          (!fetchedSettings?.layoutSettings?.showStats &&
            fetchedSettings?.layoutSettings?.dashboardLayout ===
              "one-sidebar-left") ||
          (!fetchedSettings?.layoutSettings?.showStats &&
            fetchedSettings?.layoutSettings?.dashboardLayout ===
              "one-sidebar-right")) && <SidePanelBrand />}
        {!fetchedSettings?.statSettings?.showStats &&
          eventType === "Life" &&
          !isOneBarLayout && (
            <>
              <DigitalClock />
            </>
          )}
        {!fetchedSettings?.statSettings?.showStats && (
          <hr className={`side-panel-hr-jg no-stats-hr-jg`} />
        )}
        {!fetchedSettings?.statSettings?.showStats && eventType === "Work" && (
          <SidePanelMenu />
        )}
        {eventsLoading ? (
          <LoadingSpinner
            spinnerStyle={sidePanelSpinnerStyle}
            spinnerElWidthHeight="100px"
          />
        ) : (
          <>
            {fetchedSettings?.statSettings?.showStats && (
              <SidePanelStats eventType={isOneBarLayout ? "Work" : eventType} />
            )}
            {(fetchedSettings?.statSettings?.showStats && !isOneBarLayout) ||
              (!fetchedSettings?.statSettings?.showStats &&
                eventType === "Life" && (
                  <SidePanelEvents
                    eventType={
                      isOneBarLayout
                        ? "Work"
                        : eventType
                    }
                    hasMatchingEvents={hasMatchingEvents}
                  />
                ))}

            {fetchedSettings?.statSettings?.showStats && (
              <SidePanelRecommendations
                eventType={
                  isOneBarLayout
                    ? "Work"
                    : eventType
                }
              />
            )}
          </>
        )}
      </div>
      {isOneBarLayout &&
        fetchedSettings?.statSettings?.showStats && (
          <>
            <hr className={`side-panel-hr-jg no-stats-hr-jg`} />
            <div
              className={`dashboard-side-panel-bottom-jg life-text-jg ${
                isOneBarLayout
                  ? "dashboard-side-panel-single-bottom-jg"
                  : ""
              }`}
            >
              <SidePanelStats
                eventType={
                  isOneBarLayout
                    ? "Life"
                    : eventType
                }
              />
              <SidePanelRecommendations
                eventType={
                  isOneBarLayout
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
