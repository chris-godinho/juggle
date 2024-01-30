// SidePanelRecommendations.jsx

import { useState, useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import {
  workGoalActivities,
  lifeGoalActivities,
} from "../../utils/preferredActivities.js";

export default function SidePanelRecommendations({
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

  let recommendationCount = 0;
  let targetPercentage;
  let otherPercentage;
  let activityPool = [];
  let recommendationSource = [];
  let recommendationList = [];
  let recommendationPool = [];
  let targetBalanceGoal;

  if (eventType === "Work") {
    targetBalanceGoal = userSettings?.statSettings?.balanceGoal;
    if (ignoreUnalotted) {
      targetPercentage = workPercentageIgnoreUnalotted;
      otherPercentage = lifePercentageIgnoreUnalotted;
    } else if (percentageBasis === "waking") {
      targetPercentage = workPercentage;
      otherPercentage = lifePercentage;
    } else {
      targetPercentage = workPercentageWithSleepingHours;
      otherPercentage = lifePercentageWithSleepingHours;
    }
    activityPool = userSettings.workPreferredActivities;
    recommendationSource = workGoalActivities;
  } else {
    targetBalanceGoal = 100 - userSettings?.statSettings?.balanceGoal;
    if (ignoreUnalotted) {
      targetPercentage = lifePercentageIgnoreUnalotted;
      otherPercentage = workPercentageIgnoreUnalotted;
    } else if (percentageBasis === "waking") {
      targetPercentage = lifePercentage;
      otherPercentage = workPercentage;
    } else {
      targetPercentage = lifePercentageWithSleepingHours;
      otherPercentage = workPercentageWithSleepingHours;
    }
    activityPool = userSettings.lifePreferredActivities;
    recommendationSource = lifeGoalActivities;
  }

  const preferredActivities = Array.from(
    Object.entries(activityPool)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
  );

  let dividingFactor;

  if (ignoreUnalotted) {
    dividingFactor = 50;
  } else if (percentageBasis === "waking") {
    dividingFactor = 15;
  } else {
    dividingFactor = 22.5;
  }

  if (targetPercentage < otherPercentage) {
    recommendationCount += 2;
    recommendationCount += Math.floor(
      (otherPercentage - targetPercentage) / dividingFactor
    );
  }

  if (targetPercentage < targetBalanceGoal) {
    recommendationCount += 1;
  } else {
    recommendationCount = 0;
  }

  for (let i = 0; i < recommendationCount; i++) {
    for (const selectedActivity of preferredActivities) {
      const matchingObject = recommendationSource.find(
        (activity) => activity.key === selectedActivity
      );

      if (matchingObject) {
        const suggestions = matchingObject.suggestions;

        // Add all elements from the "suggestions" field to recommendationPool
        recommendationPool.push(...suggestions);
      }
    }

    // Randomly select an element from recommendationPool
    const selectedRecommendation =
      recommendationPool[Math.floor(Math.random() * recommendationPool.length)];

    // Add it to recommendationList
    recommendationList.push(selectedRecommendation);

    // Remove the selected element from recommendationPool
    const indexToRemove = recommendationPool.indexOf(selectedRecommendation);
    if (indexToRemove !== -1) {
      recommendationPool.splice(indexToRemove, 1);
    }

    // If there are no recommendations left, stop the loop
    if (recommendationPool.length === 0) {
      break;
    }
  }

  return (
    <div className="side-panel-recommendation-list-jg">
      {recommendationList.length > 0 && (
        <>
          <hr
            className={
              eventType === "Work"
                ? "side-panel-hr-jg work-hr-jg"
                : "side-panel-hr-jg life-hr-jg"
            }
          />
          <p className="recommendations-call-action-jg">You might want to...</p>
        </>
      )}
      {recommendationList.map((recommendation, index) => (
        <p key={index} className="side-panel-recommendation-text-jg">
          {recommendation}
        </p>
      ))}
    </div>
  );
}
