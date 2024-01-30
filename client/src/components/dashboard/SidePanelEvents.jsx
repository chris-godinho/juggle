// SidePanelEvents.jsx

import React, { useState, useEffect } from "react";

import { useDataContext } from "../contextproviders/DataContext";
import { useUserSettings } from "../contextproviders/UserSettingsProvider.jsx";

import { calculateSingleEventPercentage } from "../../utils/eventUtils.js";

export default function SidePanelEvents({
  hasMatchingEvents,
  eventType,
  totalAlottedTime,
  totalAlottedTimeWithSleepingHours,
  totalAlottedTimeIgnoreUnalotted,
  showStats,
}) {
  const { events } = useDataContext();

  const { userSettings, isLoadingSettings } = useUserSettings();

  const [percentageBasis, setPercentageBasis] = useState("waking");
  const [ignoreUnalotted, setIgnoreUnalotted] = useState(false);

  console.log("[SidePanelEvents.jsx] eventType:", eventType);

  useEffect(() => {
    if (!isLoadingSettings) {
      // Data fetching is complete, update the state
      setPercentageBasis(
        userSettings.statSettings?.percentageBasis ?? "waking"
      );
      setIgnoreUnalotted(userSettings.statSettings?.ignoreUnalotted ?? false);
    }
  }, [userSettings, isLoadingSettings]);

  return (
    <>
      {showStats ? (
        <hr
          className={`side-panel-hr-jg ${
            eventType === "Work" ? "work-hr-jg" : "life-hr-jg"
          }`}
        />
      ) : (
        <p className={`side-panel-event-header-jg life-text-jg ${!showStats ? "side-panel-event-header-extra-space-jg" : ""}`}>Today's events:</p>
      )}
      <div className="side-panel-event-list-jg">
        {hasMatchingEvents ? (
          <>
            {events.map((event, index) => {
              return (
                <div key={index} className={`side-panel-event-item-jg ${showStats ? "" : "side-panel-event-item-extra-space-jg"}`}>
                  {showStats ? (
                    <>
                      {eventType.toLowerCase() === event.type.toLowerCase() && (
                        <a
                          href={"#" + event._id}
                          className={
                            eventType === "Work"
                              ? "work-text-jg"
                              : "life-text-jg"
                          }
                        >
                          <p className="side-panel-event-time-jg">
                            {(() => {
                              const eventDateObject = new Date(
                                event.eventStart
                              );
                              const eventStartTime =
                                eventDateObject.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                });
                              return eventStartTime;
                            })()}
                            {":"}
                          </p>
                          <p className="side-panel-event-title-jg">
                            {event.title}
                          </p>
                          {showStats && (
                            <p className="side-panel-event-percentage-jg">
                              {(() => {
                                const eventPercentage =
                                  calculateSingleEventPercentage(
                                    event,
                                    totalAlottedTime,
                                    totalAlottedTimeWithSleepingHours,
                                    totalAlottedTimeIgnoreUnalotted,
                                    percentageBasis,
                                    ignoreUnalotted
                                  ).toFixed(0);
                                return "(" + eventPercentage + "%)";
                              })()}
                            </p>
                          )}
                        </a>
                      )}
                    </>
                  ) : (
                    <>
                      {
                        <a href={"#" + event._id} className="no-stats-event-text-jg">
                          <p className="side-panel-event-time-jg">
                            {(() => {
                              const eventDateObject = new Date(
                                event.eventStart
                              );
                              const eventStartTime =
                                eventDateObject.toLocaleString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                });
                              return eventStartTime;
                            })()}
                            {":"}
                          </p>
                          <p className="side-panel-event-title-jg">
                            {event.title}
                          </p>
                          {showStats && (
                            <p className="side-panel-event-percentage-jg">
                              {(() => {
                                const eventPercentage =
                                  calculateSingleEventPercentage(
                                    event,
                                    totalAlottedTime
                                  ).toFixed(0);
                                return "(" + eventPercentage + "%)";
                              })()}
                            </p>
                          )}
                        </a>
                      }
                    </>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <div className="side-panel-event-item-jg">
            <p className="side-panel-event-message-jg">
              No {`${showStats ? eventType.toLowerCase() : ""} `}events for today.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
