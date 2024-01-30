// SidePanelStats.jsx

import React, { useState, useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

export default function SidePanelStats({
  eventType,
  workPercentage,
  lifePercentage,
  workPercentageWithSleepingHours,
  lifePercentageWithSleepingHours,
  workPercentageIgnoreUnalotted,
  lifePercentageIgnoreUnalotted,
}) {
  const { events } = useDataContext();

  const { userSettings, isLoadingSettings } = useUserSettings();

  const [percentageBasis, setPercentageBasis] = useState("waking");
  const [ignoreUnalotted, setIgnoreUnalotted] = useState(false);

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      setPercentageBasis(
        userSettings.statSettings?.percentageBasis ?? "waking"
      );
      setIgnoreUnalotted(userSettings.statSettings?.ignoreUnalotted ?? false);
    }
  }, [userSettings, isLoadingSettings]);

  let displayPercentage;
  if (eventType === "Work") {
    if (ignoreUnalotted) {
      displayPercentage = workPercentageIgnoreUnalotted;
    } else {
      if (percentageBasis === "waking") {
        displayPercentage = workPercentage;
      } else {
        displayPercentage = workPercentageWithSleepingHours;
      }
    }
  } else {
    if (ignoreUnalotted) {
      displayPercentage = lifePercentageIgnoreUnalotted;
    } else {
      if (percentageBasis === "waking") {
        displayPercentage = lifePercentage;
      } else {
        displayPercentage = lifePercentageWithSleepingHours;
      }
    }
  }

  let displayText;
  if (ignoreUnalotted) {
    displayText = "of your allocated time";
  } else {
    displayText =
      percentageBasis === "waking" ? "of your waking hours" : "of your day";
  }

  return (
    <>
      <div className="side-panel-top-jg">
        <p className="side-panel-stats-title-jg">{eventType}</p>
      </div>
      <div className="side-panel-middle-jg">
        <h1>{displayPercentage}%</h1>
      </div>
      <div className="side-panel-bottom-jg">
        <p>
          {displayText}
        </p>
      </div>
    </>
  );
}
