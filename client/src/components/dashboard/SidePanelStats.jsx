// SidePanelStats.jsx
// Displays percentage of time spent on work or life events

import { useEffect, useRef } from "react";

import { useDataContext } from "../contextproviders/DataContext";

import {
  findDisplayPercentage,
  findDisplayText,
} from "../../utils/eventUtils.js";

export default function SidePanelStats({ eventType }) {

  // Create a reference to the percentage display element for count up animation
  const countUpRef = useRef(null);

  const { fetchedSettings, fetchedEventData, isOneBarLayout } =
    useDataContext();
  
  // Find the display percentage and text based on the settings and event type
  const displayPercentage = findDisplayPercentage(
    eventType,
    fetchedSettings?.ignoreUnalotted,
    fetchedSettings?.percentageBasis,
    fetchedEventData?.viewStyle,
    fetchedEventData?.workPercentage,
    fetchedEventData?.workTaskPercentage,
    fetchedEventData?.workPercentageIgnoreUnalotted,
    fetchedEventData?.workPercentageWithSleepingHours,
    fetchedEventData?.lifePercentage,
    fetchedEventData?.lifeTaskPercentage,
    fetchedEventData?.lifePercentageIgnoreUnalotted,
    fetchedEventData?.lifePercentageWithSleepingHours
  );

  // Find the display text based on user's stat settings
  const displayText = findDisplayText(
    fetchedSettings?.ignoreUnalotted,
    fetchedSettings?.percentageBasis,
    fetchedSettings?.viewStyle
  );

  // Set the percentage value to the count up element and animate it
  useEffect(() => {
    if (countUpRef.current) {
      // Set time for the count up animation based on the display percentage
      countUpRef.current.style.setProperty(
        "--display-percentage-time",
        `${displayPercentage * 25}ms`
      );
      // Set the target number for the count up animation
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
