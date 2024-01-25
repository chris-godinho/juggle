import { calculateEventStats } from "../utils/eventUtils.js";

export default function SidePanelStats({ events, eventType }) {

  console.log("[SidePanelStats.jsx] events:", events);

  const { workPercentage, lifePercentage } = calculateEventStats(events);

  console.log("[SidePanelStats.jsx] workPercentage:", workPercentage);
  console.log("[SidePanelStats.jsx] lifePercentage:", lifePercentage);
  
  return (
    <>
      <div className="side-panel-top-jg">
        <h3>{eventType}</h3>
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
