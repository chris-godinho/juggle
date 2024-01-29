// DashboardSidePanel.jsx

import { useDataContext } from "../contextproviders/DataContext";

import { calculateEventStats } from "../../utils/eventUtils.js";

import LoadingSpinner from "../other/LoadingSpinner.jsx";
import SidePanelStats from "./SidePanelStats.jsx";
import SidePanelEvents from "./SidePanelEvents.jsx";
import SidePanelRecommendations from "./SidePanelRecommendations.jsx";

export default function DashboardSidePanel({ eventType }) {

  const sidePanelSpinnerStyle = {
    spinnerWidth: "16%",
    spinnerHeight: "95vh",
    spinnerElWidthHeight: "100px",
  };

  const { events, eventsLoading, userLoading } = useDataContext();

  const { eventCount, totalAlottedTime, workPercentage, lifePercentage } = calculateEventStats(events);

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
          <SidePanelStats eventType={eventType} workPercentage={workPercentage} lifePercentage={lifePercentage} />
          {hasMatchingEvents && (
            <>
              <hr className={`side-panel-hr-jg ${eventType === "Work" ? "work-hr-jg" : "life-hr-jg"}`} />
              <SidePanelEvents
                eventType={eventType}
                totalAlottedTime={totalAlottedTime}
              />
            </>
          )}
          <SidePanelRecommendations eventType={eventType} workPercentage={workPercentage} lifePercentage={lifePercentage} />
        </>
      )}
    </aside>
  );
}
