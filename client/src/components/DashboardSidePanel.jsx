// DashboardSidePanel.jsx

import { useDataContext } from "./DataContext";

import { calculateEventStats } from "../utils/eventUtils.js";

import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SidePanelStats from "../components/SidePanelStats.jsx";
import SidePanelEvents from "../components/SidePanelEvents.jsx";
import SidePanelRecommendations from "../components/SidePanelRecommendations.jsx";

export default function DashboardSidePanel({ eventType }) {

  const sidePanelSpinnerStyle = {
    spinnerWidth: "16%",
    spinnerHeight: "95vh",
    spinnerElWidthHeight: "100px",
  };

  const { events, eventsLoading, userLoading } = useDataContext();

  const { eventCount, totalAlottedTime } = calculateEventStats(events);

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
    <aside className={`dashboard-side-panel-jg ${eventType === "Work" ? "work-text-jg work-sidebar-jg" : "life-text-jg life-sidebar-jg"}`}>
      {eventsLoading || userLoading ? (
        <LoadingSpinner
          spinnerStyle={sidePanelSpinnerStyle}
          spinnerElWidthHeight="100px"
        />
      ) : (
        <>
          <SidePanelStats eventType={eventType} />
          {hasMatchingEvents && (
            <>
              <hr className={`side-panel-hr-jg ${eventType === "Work" ? "work-hr-jg" : "life-hr-jg"}`} />
              <SidePanelEvents
                eventType={eventType}
                totalAlottedTime={totalAlottedTime}
              />
            </>
          )}
          <SidePanelRecommendations eventType={eventType} />
        </>
      )}
    </aside>
  );
}
