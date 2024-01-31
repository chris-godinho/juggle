// SidePanelRecommendations.jsx

import { useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";

import { findRecommendations } from "../../utils/eventUtils.js";

import {
  workGoalActivities,
  lifeGoalActivities,
} from "../../utils/preferredActivities.js";

export default function SidePanelRecommendations({ eventType }) {
  const {
    isLoadingSettings,
    eventsLoading,
    fetchedSettings,
    fetchedEventData,
  } = useDataContext();

let recommendationList = [];

useEffect(() => {
  if (!isLoadingSettings && !eventsLoading) {
    recommendationList = findRecommendations(
      eventType,
      fetchedEventData?.ignoreUnalotted,
      fetchedSettings?.statSettings?.percentageBasis,
      fetchedSettings?.statSettings?.balanceGoal,
      fetchedSettings?.layoutSettings?.dashboardLayout,
      fetchedEventData?.workPercentage,
      fetchedEventData?.lifePercentage,
      fetchedEventData?.workPercentageWithSleepingHours,
      fetchedEventData?.lifePercentageWithSleepingHours,
      fetchedEventData?.workPercentageIgnoreUnalotted,
      fetchedEventData?.lifePercentageIgnoreUnalotted,
      workGoalActivities,
      lifeGoalActivities
    );
  }
}, [isLoadingSettings, eventsLoading]);


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
              fetchedSettings?.layoutSettings?.dashboardLayout === "one-sidebar-left" ||
              fetchedSettings?.layoutSettings?.dashboardLayout === "one-sidebar-right"
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
              fetchedSettings?.layoutSettings?.dashboardLayout === "one-sidebar-left" ||
              fetchedSettings?.layoutSettings?.dashboardLayout === "one-sidebar-right"
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
