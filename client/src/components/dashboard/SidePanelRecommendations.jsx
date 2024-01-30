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

  const settingsBalanceGoal = userSettings?.statSettings?.balanceGoal;
  const workPreferredActivities = userSettings?.workPreferredActivities;
  const lifePreferredActivities = userSettings?.lifePreferredActivities;

  const recommendationList = findRecommendations(
    eventType,
    ignoreUnalotted,
    percentageBasis,
    settingsBalanceGoal,
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

  console.log(
    "[SidePanelRecommendations.jsx] recommendationList: ",
    recommendationList
  );

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
