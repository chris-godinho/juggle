// SidePanelRecommendations.jsx

import { useUserSettings } from "./UserSettingsProvider.jsx";

import { calculateEventStats } from "../utils/eventUtils.js";

import {
  workGoalActivities,
  lifeGoalActivities,
} from "../utils/preferredActivities.js";

export default function SidePanelRecommendations({ events, eventType }) {
  const { userSettings } = useUserSettings();

  const { workPercentage, lifePercentage } = calculateEventStats(events);

  let recommendationCount = 0;
  let targetPercentage;
  let otherPercentage;
  let activityPool = [];
  let recommendationSource = [];
  let recommendationList = [];
  let recommendationPool = [];

  if (eventType === "Work") {
    targetPercentage = workPercentage;
    otherPercentage = lifePercentage;
    activityPool = userSettings.workPreferredActivities;
    recommendationSource = workGoalActivities;
  } else {
    targetPercentage = lifePercentage;
    otherPercentage = workPercentage;
    activityPool = userSettings.lifePreferredActivities;
    recommendationSource = lifeGoalActivities;
  }

  console.log("[SidePanelRecommendations.jsx] activityPool:", activityPool);

  const preferredActivities = Array.from(
    Object.entries(activityPool)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
  );

  console.log(
    "[SidePanelRecommendations.jsx] preferredActivities:",
    preferredActivities
  );

  if (targetPercentage < userSettings.statSettings.balanceGoal) {
    recommendationCount += 1;
  }

  if (targetPercentage < otherPercentage) {
    recommendationCount += 2;
    recommendationCount += Math.floor(
      (otherPercentage - targetPercentage) / 10
    );
  }

  console.log(
    "[SidePanelRecommendations.jsx] recommendationCount:",
    recommendationCount
  );

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
      console.log("[SidePanelRecommendations.jsx] No recommendations left.");
      break;
    }
  }

  console.log(
    "[SidePanelRecommendations.jsx] recommendationList:",
    recommendationList
  );

  return (
    <div className="side-panel-recommendation-list-jg">
      <hr
        className={
          eventType === "Work"
            ? "side-panel-hr-jg work-hr-jg"
            : "side-panel-hr-jg life-hr-jg"
        }
      />
      {recommendationList.length > 0 && (
        <p className="recommendations-call-action-jg">You might want to...</p>
      )}
      {recommendationList.map((recommendation, index) => (
        <p key={index} className="side-panel-recommendation-text-jg">
          {recommendation}
        </p>
      ))}
    </div>
  );
}
