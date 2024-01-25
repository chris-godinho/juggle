import { calculateSingleEventPercentage } from "../utils/eventUtils.js";

export default function SidePanelEvents({
  events,
  eventType,
  eventCount,
  totalAlottedTime,
}) {
  return (
    <div className="side-panel-event-list-jg">

      {events.map((event, index) => {
        console.log("[SidePanelEvents.jsx] event:", event);
        console.log("[SidePanelEvents.jsx] event.type:", event.type);
        return (
          <div key={index} className="side-panel-event-item-jg">
            {eventType.toLowerCase() === event.type.toLowerCase() && (
              <a
                href={"#" + event._id}
                className={
                  eventType === "Work" ? "work-text-jg" : "life-text-jg"
                }
              >
                <p className="side-panel-event-time-jg">
                  {(() => {
                    const eventDateObject = new Date(event.eventStart);
                    const eventStartTime = eventDateObject.toLocaleString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      }
                    );
                    return eventStartTime;
                  })()}
                  {":"}
                </p>
                <p className="side-panel-event-title-jg">{event.title}</p>
                <p className="side-panel-event-percentage-jg">
                  {(() => {
                    const eventPercentage = calculateSingleEventPercentage(
                      event,
                      totalAlottedTime
                    ).toFixed(0);
                    return "(" + eventPercentage + "%)";
                  })()}
                </p>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
