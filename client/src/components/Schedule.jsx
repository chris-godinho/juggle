// Schedule.jsx

import { useModal } from "../components/ModalProvider.jsx";
import EventDetails from "./EventDetails.jsx";

const Schedule = ({ events, selectedDate, eventSubtypes }) => {
  const { openModal } = useModal();

  const displayDate = new Date(selectedDate);
  displayDate.setHours(0, 0, 0, 0);

  const formatTime = (dateObject) => {
    const result = dateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return result;
  };

  return (
    <div className="schedule-container-jg">
      {Array.from(Array(48).keys()).map((index) => {
        const currentDisplayTime = new Date(displayDate);
        currentDisplayTime.setMinutes(
          currentDisplayTime.getMinutes() + index * 30
        );

        const event = events.find(
          (e) =>
            new Date(e.eventStart) <= currentDisplayTime &&
            currentDisplayTime < new Date(e.eventEnd)
        );

        return (
          <div
            key={index}
            id={index + "-block-jg"}
            className="schedule-block-jg"
          >
            <div className="schedule-block-time-jg">
              {formatTime(currentDisplayTime)}
            </div>
            <div
              className={
                event && event.type === "work"
                  ? "schedule-block-title-jg work-text-jg"
                  : event && event.type === "life"
                  ? "schedule-block-title-jg life-text-jg"
                  : "schedule-block-title-jg"
              }
            >
              <a
                className="schedule-event-line-jg"
                href="#"
                onClick={() =>
                  openModal(
                    <EventDetails
                      eventId={event._id}
                      eventTitle={event.title}
                      eventType={event.type}
                      eventSubtype={event.subtype}
                      eventDescription={event.details}
                      eventStart={event.eventStart}
                      eventEnd={event.eventEnd}
                      eventLocation={event.location}
                      eventLinks={event.links}
                      eventFiles={event.files}
                      eventPriority={event.priority}
                      eventSetReminder={event.setReminder}
                      eventReminderTime={event.reminderTime}
                      eventCompleted={event.completed}
                      eventSubtypes={eventSubtypes}
                    />
                  )
                }
              >
                {event ? event.title : ""}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Schedule;
