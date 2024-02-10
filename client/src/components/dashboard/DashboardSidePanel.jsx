// DashboardSidePanel.jsx

import { useDataContext } from "../contextproviders/DataContext";

import LoadingSpinner from "../other/LoadingSpinner.jsx";
import SidePanelBrand from "./SidePanelBrand.jsx";
import SidePanelMenu from "./SidePanelMenu.jsx";
import SidePanelStats from "./SidePanelStats.jsx";
import SidePanelEvents from "./SidePanelEvents.jsx";
import SidePanelRecommendations from "./SidePanelRecommendations.jsx";
import DigitalClock from "./DigitalClock.jsx";

export default function DashboardSidePanel({ sidebarToRender }) {
  const sidePanelSpinnerStyle = {
    spinnerWidth: "16%",
    spinnerHeight: "95vh",
    spinnerElWidthHeight: "100px",
  };

  const { eventsLoading, fetchedSettings, isOneBarLayout } = useDataContext();

  const upperOrSingleBarEventType = isOneBarLayout
    ? "Work"
    : !isOneBarLayout && sidebarToRender === "right"
    ? "Life"
    : "Work";

  const renderUpperOrSingleBarEvents =
    (fetchedSettings?.showStats && !isOneBarLayout) ||
    (!fetchedSettings?.showStats && sidebarToRender === "right");

  return (
    <aside
      className={`dashboard-side-panel-jg ${
        fetchedSettings?.showStats &&
        !isOneBarLayout &&
        sidebarToRender === "left"
          ? "work-text-jg"
          : ""
      }
        ${
          fetchedSettings?.showStats &&
          !isOneBarLayout &&
          sidebarToRender === "right"
            ? "life-text-jg"
            : ""
        } ${sidebarToRender === "left" ? "work-sidebar-jg" : ""} ${
        sidebarToRender === "right" ? "life-sidebar-jg" : ""
      }`}
    >
      <div
        className={`dashboard-side-panel-top-jg ${
          fetchedSettings?.showStats && isOneBarLayout
            ? "dashboard-side-panel-single-top-jg work-text-jg"
            : ""
        }`}
      >
        {!fetchedSettings?.showStats &&
          (sidebarToRender === "left" || isOneBarLayout) && <SidePanelBrand />}

        {!fetchedSettings?.showStats &&
          !isOneBarLayout &&
          sidebarToRender === "right" && (
            <>
              <DigitalClock />
            </>
          )}
        {!fetchedSettings?.showStats && (
          <hr className={`side-panel-hr-jg no-stats-hr-jg`} />
        )}
        {!fetchedSettings?.showStats && sidebarToRender === "left" && (
          <SidePanelMenu />
        )}
        {eventsLoading ? (
          <LoadingSpinner
            spinnerStyle={sidePanelSpinnerStyle}
            spinnerElWidthHeight="100px"
          />
        ) : (
          <>
            {fetchedSettings?.showStats && (
              <SidePanelStats eventType={upperOrSingleBarEventType} />
            )}
            {renderUpperOrSingleBarEvents && (
              <SidePanelEvents eventType={upperOrSingleBarEventType} sidebarToRender={sidebarToRender}/>
            )}
            {fetchedSettings?.showStats && (
              <SidePanelRecommendations eventType={upperOrSingleBarEventType} sidebarToRender={sidebarToRender} />
            )}
          </>
        )}
      </div>
      {fetchedSettings?.showStats && isOneBarLayout && (
        <>
          <hr className="side-panel-hr-jg no-stats-hr-jg" />
          <div className="dashboard-side-panel-bottom-jg life-text-jg">
            <SidePanelStats eventType="Life" />
            <SidePanelRecommendations eventType="Life" sidebarToRender={sidebarToRender} />
          </div>
        </>
      )}
    </aside>
  );
}
