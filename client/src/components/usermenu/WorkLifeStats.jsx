// WorkLifeStats.jsx
// Displays work/life stats based on user's logged events

import { useState, useEffect, useRef } from "react";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { calculateMacroStats } from "../../utils/eventUtils.js";

export default function WorkLifeStats() {

  // Initialize refs for stats bars
  const eventBar = useRef(null);
  const timeBar = useRef(null);
  const averageEventBar = useRef(null);
  const averageTimeBar = useRef(null);

  const { userSettings, isLoadingSettings } = useUserSettings();

  // Initialize state for selected stat type
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

  // Update stats bars' widths after stats are calculated
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
      const newAverageEventWidth = `${
        (displayMacroStats?.averageWorkEventsPerDay /
          displayMacroStats?.averageEventsPerDay) *
        100
      }%`;
      averageEventBar.current.style.width = newAverageEventWidth;
      const newAverageTimeWidth = `${
        (displayMacroStats?.averageWorkTimePerDay /
          displayMacroStats?.averageTimePerDay) *
        100
      }%`;
      averageTimeBar.current.style.width = newAverageTimeWidth;
    }
  }, [selectedStat, displayMacroStats]);

  // Update displayed stats based on selected stat type
  const handleStatSelectChange = (e) => {
    setSelectedStat(e.target.value);
    switch (e.target.value) {
      case "all-time":
        setDisplayMacroStats(macroStats?.allTimeMacroStats);
        break;
      case "this-month":
        setDisplayMacroStats(macroStats?.currentMonthMacroStats);
        break;
      case "last-month":
        setDisplayMacroStats(macroStats?.previousMonthMacroStats);
        break;
      case "this-week":
        setDisplayMacroStats(macroStats?.currentWeekMacroStats);
        break;
      case "last-week":
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
          <div className="stats-bar-block-jg">
            <h4 className="stats-subtitle-jg">
            Average events per day: {displayMacroStats?.averageEventsPerDay}
            </h4>
            <div className="stats-bar-jg">
              <div ref={averageEventBar} className="stats-bar-filled-jg"></div>
            </div>
            <div className="stats-bar-labels-jg">
              <p className="work-text-jg" title="Average Work events per day">
              {displayMacroStats?.averageWorkEventsPerDay}
              </p>
              <p className="life-text-jg" title="Average Life events per day">
              {displayMacroStats?.averageLifeEventsPerDay}
              </p>
            </div>
          </div>
          <div className="stats-bar-block-jg">
            <h4 className="stats-subtitle-jg">
            Average event time per day: {displayMacroStats?.formattedAverageTimePerDay}
            </h4>
            <div className="stats-bar-jg">
              <div ref={averageTimeBar} className="stats-bar-filled-jg"></div>
            </div>
            <div className="stats-bar-labels-jg">
              <p className="work-text-jg" title="Average Work event time per day">
              {displayMacroStats?.formattedAverageWorkTimePerDay}
              </p>
              <p className="life-text-jg" title="Average Life event time per day">
              {displayMacroStats?.formattedAverageLifeTimePerDay}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
