// WorkLifeStats.jsx

import { useState, useEffect, useRef } from "react";

import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { calculateMacroStats } from "../../utils/eventUtils.js";

export default function WorkLifeStats() {

  const eventBar = useRef(null);
  const timeBar = useRef(null);

  const { userSettings, isLoadingSettings } = useUserSettings();

  const [result2, setResult2] = useState({});

  useEffect(() => {
    if (!isLoadingSettings) {
      setResult2(calculateMacroStats(userSettings?.events || []));
    }
  }, [isLoadingSettings, userSettings]);

  console.log("[WorkLifeStats.jsx] result2:", result2);

  return (
    <div className="modal-inner-content-jg">
      <div className="stats-top-row-jg">
        <h1 className="stats-username-jg">username</h1>
        <select className="stats-select-jg">
          <option value="all-time">All time</option>
          <option value="this-month">This month</option>
          <option value="last-month">Last month</option>
          <option value="this-week">This week</option>
          <option value="last-week">Last week</option>
        </select>
      </div>
      <div className="stats-bar-block-jg">
        <h4 className="stats-subtitle-jg">Total events: XX</h4>
        <div className="stats-bar-jg">
          <div ref={eventBar} className="stats-bar-filled-jg"></div>
        </div>
        <div className="stats-bar-labels-jg">
          <p className="work-text-jg">XX</p>
          <p className="life-text-jg">XX</p>
        </div>
      </div>
      <div className="stats-bar-block-jg">
        <h4 className="stats-subtitle-jg">Total event time: XX</h4>
        <div className="stats-bar-jg">
          <div ref={timeBar} className="stats-bar-filled-jg"></div>
        </div>
        <div className="stats-bar-labels-jg">
          <p className="work-text-jg">XX</p>
          <p className="life-text-jg">XX</p>
        </div>
      </div>
      <div className="stats-averages-box-jg">
        <h4 className="stats-subtitle-jg">Average events per day:</h4>
        <div className="stats-averages-row-jg">
          <p className="work-text-jg">XX</p>
          <p>XX</p>
          <p className="life-text-jg">XX</p>
        </div>
        <h4 className="stats-subtitle-jg">Average event time per day:</h4>
        <div className="stats-averages-row-jg">
          <p className="work-text-jg">XX</p>
          <p>XX</p>
          <p className="life-text-jg">XX</p>
        </div>
      </div>
    </div>
  );
}
