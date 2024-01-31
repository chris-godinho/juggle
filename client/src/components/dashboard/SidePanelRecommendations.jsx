// SidePanelRecommendations.jsx

import { useDataContext } from "../contextproviders/DataContext";

import { findRecommendations } from "../../utils/eventUtils.js";

import {
  workGoalActivities,
  lifeGoalActivities,
} from "../../utils/preferredActivities.js";

export default function SidePanelRecommendations({ eventType }) {
  const {
    percentageBasis,
    ignoreUnalotted,
    dashboardLayout,
    workPercentage,
    lifePercentage,
    workPercentageWithSleepingHours,
    lifePercentageWithSleepingHours,
    workPercentageIgnoreUnalotted,
    lifePercentageIgnoreUnalotted,
    workPreferredActivities,
    lifePreferredActivities,
    balanceGoal,
  } = useDataContext();

  const recommendationList = findRecommendations(
    eventType,
    ignoreUnalotted,
    percentageBasis,
    balanceGoal,
    dashboardLayout,
    workPercentage,
    lifePercentage,
    workPercentageWithSleepingHours,
    lifePercentageWithSleepingHours,
    workPercentageIgnoreUnalotted,
    lifePercentageIgnoreUnalotted,
    workPreferredActivities,
    lifePreferredActivities,
    workGoalActivities,
    lifeGoalActivities
  );

  return (
    <>
      {recommendationList.length > 0 && (
        <hr
          className={
            eventType === "Work"
              ? "side-panel-hr-jg work-hr-jg"
              : "side-panel-hr-jg life-hr-jg"
          }
        />
      )}
      <div className="side-panel-recommendation-list-jg">
        {recommendationList.length > 0 && (
          <p
            className={`recommendations-call-action-jg ${
              dashboardLayout === "one-sidebar-left" ||
              dashboardLayout === "one-sidebar-right"
                ? "recommendations-call-action-one-sidebar-jg"
                : ""
            }`}
          >
            You might want to...
          </p>
        )}
        {recommendationList.map((recommendation, index) => (
          <p
            key={index}
            className={`side-panel-recommendation-text-jg ${
              dashboardLayout === "one-sidebar-left" ||
              dashboardLayout === "one-sidebar-right"
                ? "recommendation-text-one-sidebar-jg"
                : ""
            }`}
          >
            {recommendation}
          </p>
        ))}
      </div>
    </>
  );
}
