// SidePanelStats.jsx

import { useEffect, useRef } from "react";

import { useDataContext } from "../contextproviders/DataContext";

import {
  findDisplayPercentage,
  findDisplayText,
} from "../../utils/eventUtils.js";

export default function SidePanelStats({ eventType }) {
  const countUpRef = useRef(null);

  const { fetchedSettings, fetchedEventData, isOneBarLayout } =
    useDataContext();
  
  const displayPercentage = findDisplayPercentage(
    eventType,
    fetchedSettings?.ignoreUnalotted,
    fetchedSettings?.percentageBasis,
    fetchedEventData?.workPercentage,
    fetchedEventData?.workPercentageIgnoreUnalotted,
    fetchedEventData?.workPercentageWithSleepingHours,
    fetchedEventData?.lifePercentage,
    fetchedEventData?.lifePercentageIgnoreUnalotted,
    fetchedEventData?.lifePercentageWithSleepingHours
  );

  const displayText = findDisplayText(
    fetchedSettings?.ignoreUnalotted,
    fetchedSettings?.percentageBasis
  );

  useEffect(() => {
    // Set the --num variable to the target number on the referenced element
    if (countUpRef.current) {
      countUpRef.current.style.setProperty(
        "--display-percentage-time",
        `${displayPercentage * 25}ms`
      );
      countUpRef.current.style.setProperty("--num", displayPercentage);
    }
  }, [displayPercentage]);

  return (
    <>
      <div
        className={`side-panel-top-jg ${
          isOneBarLayout ? "side-panel-stats-top-one-sidebar-jg" : ""
        }`}
      >
        <p
          className={`side-panel-stats-title-jg ${
            isOneBarLayout ? "side-panel-stats-title-one-sidebar-jg" : ""
          }`}
        >
          {eventType}
        </p>
      </div>
      <div
        className={`side-panel-middle-jg ${
          isOneBarLayout ? "side-panel-stats-middle-one-sidebar-jg" : ""
        }`}
      >
        <h1 ref={countUpRef} className="display-percentage-jg"></h1>
      </div>
      <div
        className={`side-panel-bottom-jg ${
          isOneBarLayout ? "side-panel-stats-bottom-one-sidebar-jg" : ""
        }`}
      >
        <p>{displayText}</p>
      </div>
    </>
  );
}
