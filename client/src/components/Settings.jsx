import React, { useState } from "react";

import DataContext from "./DataContext.jsx";
import { useColorScheme } from "../components/ColorSchemeProvider.jsx";

import SleepDropdownArea from "./SleepDropdownArea";
import WorkLifeSlider from "./WorkLifeSlider";

import {
  lifeGoalActivities,
  workGoalActivities,
} from "../utils/preferredActivities.js";
import { colorSchemes } from "../utils/colorSchemes.js";

export default function Settings() {

  const { changeColorScheme } = useColorScheme();

  const [settingsScreen, setSettingsScreen] = useState("stats");

  // TODO; Initialize this with the user's data
  const [formData, setFormData] = useState({});

  const handleInputChange = (event) => {};

  return (
    <DataContext.Provider value={{ formData, setFormData }}>
      <div className="modal-inner-content-jg">
        <h1 className="settings-title-jg">Settings</h1>
        <div className="settings-container-jg">
          <div className="settings-sidebar-menu-jg">
            <a
              href="#"
              className={
                settingsScreen === "stats"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("stats")}
            >
              Stats
            </a>
            <a
              href="#"
              className={
                settingsScreen === "sleepingHours"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("sleepingHours")}
            >
              Sleeping Hours
            </a>
            <a
              href="#"
              className={
                settingsScreen === "preferredActivities"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("preferredActivities")}
            >
              Preferred Activities
            </a>
            <a
              href="#"
              className={
                settingsScreen === "events"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("events")}
            >
              Events
            </a>
            <a
              href="#"
              className={
                settingsScreen === "layout"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("layout")}
            >
              Layout
            </a>
            <a
              href="#"
              className={
                settingsScreen === "theme"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("theme")}
            >
              Theme
            </a>
            <a
              href="#"
              className={
                settingsScreen === "localization"
                  ? "settings-sidebar-item-jg settings-active-submenu-jg"
                  : "settings-sidebar-item-jg"
              }
              onClick={() => setSettingsScreen("localization")}
            >
              Localization
            </a>
          </div>
          <div className="settings-main-jg">
            {settingsScreen === "stats" ? (
              <div className="settings-stats-container-jg">
                <label
                  key="work-life-optout-jg"
                  className="settings-stats-checkbox-jg checkbox-jg"
                  title="Uncheck this box to opt out of work-life balance tracking."
                >
                  <input type="checkbox" name="work-life-optout-jg" />
                  Show Work/Life balance statistics
                </label>
                <div title="Use the slider to set your ideal work/life balance.">
                  <h3 className="settings-label-jg">Work/Life balance Goal</h3>
                  <div className="settings-slider-container-jg">
                    <WorkLifeSlider setFormData={setFormData} />
                  </div>
                </div>
                <div
                  className="settings-select-line-jg"
                  title="The total number of hours upon which your stats are calculated."
                >
                  <p className="settings-label-jg">
                    Percentage Calculation Basis
                  </p>
                  <select
                    className="settings-select-jg"
                    name="percentage-calculation-basis-jg"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="waking-hours">Your waking hours</option>
                    <option value="entire-day">Entire day</option>
                  </select>
                </div>
                <label
                  key="ignore-unalloted-time-jg"
                  className="settings-stats-checkbox-jg checkbox-jg"
                  title="Check this box to ignore unallotted time when calculating your stats (Work and Life time will always add to 100%)."
                >
                  <input type="checkbox" name="ignore-unalloted-time-jg" />
                  Ignore unalotted time
                </label>
              </div>
            ) : settingsScreen === "sleepingHours" ? (
              <>
                <p className="settings-top-label-jg sleeping-hours-label-jg">
                  Set your regular sleeping hours here. All statistics will
                  ignore those hours whan calculated.
                </p>
                <SleepDropdownArea />
              </>
            ) : settingsScreen === "preferredActivities" ? (
              <div className="settings-activities-container-jg">
                <p className="settings-top-label-jg">
                  Check all activities you would like to be considered when
                  generating recommendations.
                </p>
                <div
                  className="settings-select-line-jg"
                  title="The total number of hours upon which your stats are calculated."
                >
                  <p className="settings-label-jg">Event Type</p>
                  <select
                    className="settings-select-jg"
                    name="subtype"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="work">Work</option>
                    <option value="life">Life</option>
                  </select>
                </div>
              </div>
            ) : settingsScreen === "events" ? (
              <div className="settings-events-container-jg">
                <label
                  key="work-life-optout-jg"
                  className="settings-stats-checkbox-jg checkbox-jg"
                  title="If you haven't marked an event as complete by the time it ends, it will be marked as complete automatically. This will not apply to older events."
                >
                  <input type="checkbox" name="work-life-optout-jg" />
                  Mark events as complete after their end time
                </label>
                <h3 className="settings-label-jg">Event Categories</h3>
                <p className="settings-label-jg">
                  Add or remove categories for your events here.
                </p>
                <div className="settings-events-line-jg">
                  <input
                    type="text"
                    name="details"
                    value={""}
                    className="settings-input-jg"
                    placeholder="New category name"
                    onChange={handleInputChange}
                  />
                  <select
                    className="settings-select-jg"
                    name="subtype"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="work">Work</option>
                    <option value="life">Life</option>
                  </select>
                  <button className="button-jg">Add</button>
                </div>
                <div className="settings-events-line-jg">
                  <select
                    className="settings-select-jg"
                    name="subtype"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="work">Work</option>
                    <option value="life">Life</option>
                  </select>
                  <button className="button-jg">Remove</button>
                </div>
                <p className="settings-label-jg">
                  Note: Removing a category won't delete any events created
                  under it, but it will remove the category from the events.
                </p>
              </div>
            ) : settingsScreen === "layout" ? (
              <div className="settings-layout-container-jg">
                <h3 className="settings-top-label-jg">Dashboard Layout</h3>
                <div className="settings-layout-card-container-jg">
                  <div className="settings-card-jg">
                    <div className="settings-thumbnail-jg">
                      <a href="#" onClick={""}>
                        <img
                          src="/layouts/layout1.png"
                          alt="Dual Sidebar Layout"
                          className="settings-thumbnail-image-jg"
                        />
                      </a>
                    </div>
                    <p className="settings-thumbnail-label-jg">Two Sidebars</p>
                  </div>
                  <div className="settings-card-jg">
                    <div className="settings-thumbnail-jg">
                      <a href="#" onClick={""}>
                        <img
                          src="/layouts/layout2.png"
                          alt="Left Sidebar Layout"
                          className="settings-thumbnail-image-jg"
                        />
                      </a>
                    </div>
                    <p className="settings-thumbnail-label-jg">
                      One Sidebar (Left)
                    </p>
                  </div>
                  <div className="settings-card-jg">
                    <div className="settings-thumbnail-jg">
                      <a href="#" onClick={""}>
                        <img
                          src="/layouts/layout3.png"
                          alt="Right Sidebar Layout"
                          className="settings-thumbnail-image-jg"
                        />
                      </a>
                    </div>
                    <p className="settings-thumbnail-label-jg">
                      One Sidebar (Right)
                    </p>
                  </div>
                  <div className="settings-card-jg">
                    <div className="settings-thumbnail-jg">
                      <a href="#" onClick={""}>
                        <img
                          src="/layouts/layout4.png"
                          alt="No Sidebar Layout"
                          className="settings-thumbnail-image-jg"
                        />
                      </a>
                    </div>
                    <p className="settings-thumbnail-label-jg">No Sidebars</p>
                  </div>
                </div>
                <div
                  className="settings-select-line-jg"
                  title="Calendar: Events are displayed as boxes; Task List: Events are displayed as a list."
                >
                  <p className="settings-label-jg">View Style</p>
                  <select
                    className="settings-select-jg"
                    name="view-style"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="calendar">Calendar</option>
                    <option value="task-list">Task List</option>
                  </select>
                </div>
              </div>
            ) : settingsScreen === "theme" ? (
              <div className="settings-theme-container-jg">
                <h3 className="settings-top-label-jg settings-theme-top-label-jg">
                  Color Theme
                </h3>
                <div className="settings-theme-card-container-jg">
                  {colorSchemes.map((scheme, index) => (
                    <div key={index} className="settings-card-jg">
                      <div className="settings-thumbnail-jg">
                        <a
                          href="#"
                          onClick={() => changeColorScheme(scheme.key)}
                        >
                          <img
                            src={`/colorSchemes/${scheme.image}`}
                            alt={`Color Scheme Sample ${index + 1}`}
                            className="settings-thumbnail-image-jg"
                          />
                        </a>
                      </div>
                      <p className="settings-thumbnail-label-jg">
                        {scheme.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="settings-localization-container">
                <div
                  className="settings-select-line-jg"
                  title="Select your local timezone."
                >
                  <p className="settings-label-jg">Time Zone</p>
                  <select
                    className="settings-select-jg"
                    name="time-zone"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="-12:00">UTC-12:00</option>
                    <option value="-11:00">UTC-11:00</option>
                    <option value="-10:00">UTC-10:00</option>
                    <option value="-09:00">UTC-09:00</option>
                    <option value="-08:00">UTC-08:00</option>
                    <option value="-07:00">UTC-07:00</option>
                    <option value="-06:00">UTC-06:00</option>
                    <option value="-05:00">UTC-05:00</option>
                    <option value="-04:00">UTC-04:00</option>
                    <option value="-03:00">UTC-03:00</option>
                    <option value="-02:00">UTC-02:00</option>
                    <option value="-01:00">UTC-01:00</option>
                    <option value="00:00">UTC±00:00 (UTC)</option>
                    <option value="+01:00">UTC+01:00</option>
                    <option value="+02:00">UTC+02:00</option>
                    <option value="+03:00">UTC+03:00</option>
                    <option value="+04:00">UTC+04:00</option>
                    <option value="+05:00">UTC+05:00</option>
                    <option value="+06:00">UTC+06:00</option>
                    <option value="+07:00">UTC+07:00</option>
                    <option value="+08:00">UTC+08:00</option>
                    <option value="+09:00">UTC+09:00</option>
                    <option value="+10:00">UTC+10:00</option>
                    <option value="+11:00">UTC+11:00</option>
                    <option value="+12:00">UTC+12:00</option>
                    <option value="+13:00">UTC+13:00</option>
                    <option value="+14:00">UTC+14:00</option>
                  </select>
                </div>
                <div
                  className="settings-select-line-jg"
                  title="Select your desired date format."
                >
                  <p className="settings-label-jg">Date Format</p>
                  <select
                    className="settings-select-jg"
                    name="date-format"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="mm-dd-yyyy">01/07/1981</option>
                    <option value="dd-mm-yyyy">07/01/1981</option>
                    <option value="yyyy-mm-dd">1981/01/07</option>
                    <option value="yyyy-dd-mm">1981/07/01</option>
                    <option value="month-dd-yyyy">January 7, 1981</option>
                    <option value="dd-month-yyyy">7 January 1981</option>
                  </select>
                </div>
                <div
                  className="settings-select-line-jg"
                  title="Select your desired time format."
                >
                  <p className="settings-label-jg">Time Format</p>
                  <select
                    className="settings-select-jg"
                    name="time-format"
                    value={""}
                    onChange={handleInputChange}
                  >
                    <option value="12-hour">02:25 PM</option>
                    <option value="24-hour">14:25</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DataContext.Provider>
  );
}
