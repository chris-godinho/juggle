// SidePanelRecommendations.jsx

import { useState, useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { findRecommendations } from "../../utils/eventUtils.js";

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

  const localStorageLayout = localStorage.getItem("layout");

  const [percentageBasis, setPercentageBasis] = useState("waking");
  const [ignoreUnalotted, setIgnoreUnalotted] = useState(false);
  const [workPreferredActivities, setWorkPreferredActivities] = useState([]);
  const [lifePreferredActivities, setLifePreferredActivities] = useState([]);
  const [settingsBalanceGoal, setSettingsBalanceGoal] = useState(0);
  const [dashboardLayout, setDashboardLayout] = useState(
    localStorageLayout || "two-sidebars"
  );

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      setPercentageBasis(
        userSettings.statSettings?.percentageBasis ?? "waking"
      );
      setIgnoreUnalotted(userSettings.statSettings?.ignoreUnalotted ?? false);
      setWorkPreferredActivities(userSettings.workPreferredActivities ?? []);
      setLifePreferredActivities(userSettings.lifePreferredActivities ?? []);
      setSettingsBalanceGoal(userSettings.statSettings?.balanceGoal ?? 0);
      setDashboardLayout(
        userSettings?.layoutSettings?.dashboardLayout ??
          localStorageLayout ??
          "two-sidebars"
      );
    }
  }, [userSettings, isLoadingSettings]);

  const recommendationList = findRecommendations(
    eventType,
    ignoreUnalotted,
    percentageBasis,
    settingsBalanceGoal,
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
