// SidePanelStats.jsx

import { useDataContext } from "../contextproviders/DataContext";

export default function SidePanelStats({ eventType, workPercentage, lifePercentage }) {

  const { events } = useDataContext();

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
