// WorkLifeStats.jsx

import { useState, useEffect, useRef } from "react";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { calculateMacroStats } from "../../utils/eventUtils.js";

export default function WorkLifeStats() {
  const eventBar = useRef(null);
  const timeBar = useRef(null);

  const { userSettings, isLoadingSettings } = useUserSettings();

  const [selectedStat, setSelectedStat] = useState("all-time");
  const [macroStats, setMacroStats] = useState({});
  const [displayMacroStats, setDisplayMacroStats] = useState({});

  useEffect(() => {
    if (!isLoadingSettings) {
      const results = calculateMacroStats(userSettings?.events || []);
      if (results) {
        setMacroStats((prevMacroStats) => {
          const newDisplayStats = results.allTimeMacroStats;
          setDisplayMacroStats(newDisplayStats);
          return results;
        });
      }
    }
  }, [isLoadingSettings, userSettings]);

  useEffect(() => {
    if (displayMacroStats?.totalEventCount > 0) {
      const newEventWidth = `${
        (displayMacroStats?.workEventCount /
          displayMacroStats?.totalEventCount) *
        100
      }%`;
      eventBar.current.style.width = newEventWidth;
      const newTimeWidth = `${
        (displayMacroStats?.workEventTime / displayMacroStats?.totalEventTime) *
        100
      }%`;
      timeBar.current.style.width = newTimeWidth;
    }
  }, [selectedStat, displayMacroStats]);

  console.log("[WorkLifeStats.jsx] macroStats:", macroStats);
  console.log("[WorkLifeStats.jsx] displayMacroStats:", displayMacroStats);

  const handleStatSelectChange = (e) => {
    setSelectedStat(e.target.value);
    switch (e.target.value) {
      case "all-time":
        console.log("all-time");
        console.log(macroStats?.allTimeMacroStats);
        setDisplayMacroStats(macroStats?.allTimeMacroStats);
        break;
      case "this-month":
        console.log("this-month");
        console.log(macroStats?.thisMonthMacroStats);
        setDisplayMacroStats(macroStats?.currentMonthMacroStats);
        break;
      case "last-month":
        console.log("last-month");
        console.log(macroStats?.lastMonthMacroStats);
        setDisplayMacroStats(macroStats?.previousMonthMacroStats);
        break;
      case "this-week":
        console.log("this-week");
        console.log(macroStats?.thisWeekMacroStats);
        setDisplayMacroStats(macroStats?.currentWeekMacroStats);
        break;
      case "last-week":
        console.log("last-week");
        console.log(macroStats?.lastWeekMacroStats);
        setDisplayMacroStats(macroStats?.previousWeekMacroStats);
        break;
      default:
        break;
    }
  };

  return (
    <div className="modal-inner-content-jg stats-inner-content-jg">
      <div className="stats-top-row-jg">
        <h2 className="stats-username-jg">
          Stats for {userSettings?.username}
        </h2>
        <select
          className="stats-select-jg"
          value={selectedStat}
          onChange={handleStatSelectChange}
        >
          <option value="all-time">All time</option>
          <option value="this-month">This month</option>
          <option value="last-month">Last month</option>
          <option value="this-week">This week</option>
          <option value="last-week">Last week</option>
        </select>
      </div>
      {displayMacroStats?.totalEventCount === 0 ? (
        <div className="stats-no-events-message-container-jg">
          <h2>No events to display for this period.</h2>
        </div>
      ) : (
        <>
          <div className="stats-bar-block-jg">
            <h4 className="stats-subtitle-jg">
              Total events: {displayMacroStats?.totalEventCount}
            </h4>
            <div className="stats-bar-jg">
              <div ref={eventBar} className="stats-bar-filled-jg"></div>
            </div>
            <div className="stats-bar-labels-jg">
              <p className="work-text-jg" title="Total Work events">
                {displayMacroStats?.workEventCount}
              </p>
              <p className="life-text-jg" title="Total Life events">
                {displayMacroStats?.lifeEventCount}
              </p>
            </div>
          </div>
          <div className="stats-bar-block-jg">
            <h4 className="stats-subtitle-jg">
              Total event time: {displayMacroStats?.formattedTotalEventTime}
            </h4>
            <div className="stats-bar-jg">
              <div ref={timeBar} className="stats-bar-filled-jg"></div>
            </div>
            <div className="stats-bar-labels-jg">
              <p className="work-text-jg" title="Total Work event time">
                {displayMacroStats?.formattedWorkEventTime}
              </p>
              <p className="life-text-jg" title="Total Life event time">
                {displayMacroStats?.formattedLifeEventTime}
              </p>
            </div>
          </div>
          <div className="stats-averages-box-jg">
            <h4 className="stats-subtitle-jg">Average events per day:</h4>
            <div className="stats-averages-row-jg">
              <p className="work-text-jg" title="Average Work events per day">
                {displayMacroStats?.averageWorkEventsPerDay}
              </p>
              <p title="Average total events per day">
                {displayMacroStats?.averageEventsPerDay}
              </p>
              <p className="life-text-jg" title="Average Life events per day">
                {displayMacroStats?.averageLifeEventsPerDay}
              </p>
            </div>
            <h4 className="stats-subtitle-jg">Average event time per day:</h4>
            <div className="stats-averages-row-jg">
              <p
                className="work-text-jg"
                title="Average Work event time per day"
              >
                {displayMacroStats?.formattedAverageWorkTimePerDay}
              </p>
              <p title="Average total event time per day">
                {displayMacroStats?.formattedAverageTimePerDay}
              </p>
              <p
                className="life-text-jg"
                title="Average Life event time per day"
              >
                {displayMacroStats?.formattedAverageLifeTimePerDay}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
