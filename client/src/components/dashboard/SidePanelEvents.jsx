// SidePanelEvents.jsx
// Displays a list of events in the side panel based on the event type (or all events in no-stats setting)

import { useDataContext } from "../contextproviders/DataContext";

import { calculateSingleEventPercentage } from "../../utils/eventUtils.js";

export default function SidePanelEvents({ eventType, sidebarToRender }) {
  const { events, fetchedSettings, fetchedEventData } = useDataContext();

  // Format event start time for display
  const formatEventStartTime = (eventStart) => {
    const eventDateObject = new Date(eventStart);
    const eventStartTime = eventDateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return eventStartTime;
  };

  // Compile the list of events based on the event type
  const compileEventList = (events, eventType) => {
    const compiledList = events.map((event, index) => {
      // If the event type matches the current event (or in no-stats setting), format the event string
      if (
        eventType.toLowerCase() === event.type.toLowerCase() ||
        !fetchedSettings?.showStats
      ) {
        const formattedEvent = {};
        formattedEvent.eventId = event._id;
        formattedEvent.startTime = formatEventStartTime(event.eventStart);
        formattedEvent.title = event.title;
        formattedEvent.isAllDay = event.isAllDay;
        if (fetchedSettings?.showStats) {
          const eventPercentage = calculateSingleEventPercentage(
            event,
            fetchedEventData?.totalAlottedTime,
            fetchedEventData?.totalAlottedTimeWithSleepingHours,
            fetchedEventData?.totalAlottedTimeIgnoreUnalotted,
            fetchedSettings?.percentageBasis,
            fetchedSettings?.ignoreUnalotted
          ).toFixed(0);
          formattedEvent.percentage = " (" + eventPercentage + "%)";
        }
        return formattedEvent;
      }
      // If the condition is not satisfied, return null
      return null;
    });

    // Filter out null values from the array
    const filteredList = compiledList.filter((event) => event !== null);

    return filteredList;
  };

  // Compile the list of events based on the event type
  const compiledEventList = compileEventList(events, eventType);

  return (
    <>
      {fetchedSettings?.showStats && (
        <hr
          className={`${
            eventType === "Work"
              ? "side-panel-hr-jg work-hr-jg"
              : " side-panel-hr-jg life-hr-jg"
          } ${
            sidebarToRender === "left"
              ? "recommendation-left-top-hr-jg"
              : "recommendation-right-top-hr-jg"
          }`}
        />
      )}
      {!fetchedSettings?.showStats && sidebarToRender === "right" && (
        <p className="side-panel-event-header-jg life-text-jg side-panel-event-header-extra-space-jg">
          Today's events:
        </p>
      )}
      <div className="side-panel-event-list-jg">
        {compiledEventList.length > 0 ? (
          <>
            {compiledEventList.map((formattedEvent) => {
              return (
                <div
                  key={formattedEvent.eventId}
                  className={`side-panel-event-item-jg ${
                    !fetchedSettings?.showStats
                      ? "side-panel-event-item-extra-space-jg"
                      : ""
                  }`}
                  title={`${formattedEvent.title} (${formattedEvent.startTime})`}
                >
                  <a
                    href={"#" + formattedEvent.eventId}
                    className={`${
                      fetchedSettings?.showStats ? eventType.toLowerCase() : ""
                    }-text-jg ${
                      !fetchedSettings?.showStats && "no-stats-event-text-jg"
                    }`}
                  >
                    <p className="side-panel-event-time-jg">
                      {formattedEvent.isAllDay
                        ? "All Day"
                        : formattedEvent.startTime}
                      {":"}
                    </p>
                    <p className="side-panel-event-title-jg">
                      {formattedEvent.title}
                    </p>
                    {fetchedSettings?.showStats &&
                      fetchedSettings?.viewStyle === "calendar" && (
                        <p className="side-panel-event-percentage-jg">
                          {formattedEvent.percentage}
                        </p>
                      )}
                  </a>
                </div>
              );
            })}
          </>
        ) : (
          <div className="side-panel-event-item-jg">
            <p className="side-panel-event-message-jg">
              No{" "}
              {`${fetchedSettings?.showStats ? eventType.toLowerCase() : ""} `}
              events for today.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
