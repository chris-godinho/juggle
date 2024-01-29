// SidePanelStats.jsx

import { useDataContext } from "../contextproviders/DataContext";

import { calculateEventStats } from "../../utils/eventUtils.js";

export default function SidePanelStats({ eventType }) {

  const { events } = useDataContext();

  const { workPercentage, lifePercentage } = calculateEventStats(events);

  return (
    <>
      <div className="side-panel-top-jg">
        <p className="side-panel-stats-title-jg">{eventType}</p>
      </div>
      <div className="side-panel-middle-jg">
        <h1>{eventType === "Work" ? workPercentage : lifePercentage}%</h1>
      </div>
      <div className="side-panel-bottom-jg">
        <p>of your waking hours</p>
      </div>
    </>
  );
}
