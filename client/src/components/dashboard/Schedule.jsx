// Schedule.jsx

import { useMutation } from "@apollo/client";

import { useModal } from "../contextproviders/ModalProvider.jsx";
import EventDetails from "../dashboard/EventDetails.jsx";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

import { UPDATE_EVENT } from "../../utils/mutations.js";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const Schedule = ({ events, selectedDate, eventSubtypes, eventsRefetch }) => {
  const { openModal } = useModal();

  const [updateEvent] = useMutation(UPDATE_EVENT);

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

  const handleEventClick = (event) => {
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
        eventsRefetch={eventsRefetch}
      />
    );
  };

  const handleEventChange = async (layout) => {
    // TODO: When an event overlaps with another, resize the other event accordingly
    // (if there less than five on that same time block)

    console.log("[Schedule.jsx] layout:", layout);

    // Iterate through each moved event
    for (const movedEvent of layout) {
      const eventId = movedEvent.i;

      // Find the corresponding event in the events array
      const eventToUpdate = events.find((event) => event._id === eventId);

      console.log("[Schedule.jsx] eventToUpdate:", eventToUpdate);

      if (eventToUpdate) {
        // Calculate new start time and duration based on the moved layout
        const newStartTimeMinutes = movedEvent.y * 30; // Assuming each row represents 30 minutes
        const newEndTimeMinutes = newStartTimeMinutes + movedEvent.h * 30;

        const updatedEvent = {
          eventId: eventToUpdate._id,
          title: eventToUpdate.title,
          type: eventToUpdate.type,
          subtype: eventToUpdate.subtype,
          details: eventToUpdate.details,
          eventStart: new Date(selectedDate),
          eventEnd: new Date(selectedDate),
          location: eventToUpdate.location,
          links: eventToUpdate.links,
          files: eventToUpdate.files,
          priority: eventToUpdate.priority,
          setReminder: eventToUpdate.setReminder,
          reminderTime: eventToUpdate.reminderTime,
          completed: eventToUpdate.completed,
        };

        updatedEvent.eventStart.setMinutes(newStartTimeMinutes);
        updatedEvent.eventEnd.setMinutes(newEndTimeMinutes);

        try {
          await updateEvent({
            variables: {
              eventId: updatedEvent.eventId,
              title: updatedEvent.title,
              type: updatedEvent.type,
              subtype: updatedEvent.subtype,
              details: updatedEvent.details,
              eventStart: updatedEvent.eventStart,
              eventEnd: updatedEvent.eventEnd,
              location: updatedEvent.location,
              links: updatedEvent.links,
              files: updatedEvent.files,
              priority: updatedEvent.priority,
              setReminder: updatedEvent.setReminder,
              reminderTime: updatedEvent.reminderTime,
              completed: updatedEvent.completed,
            },
          });

          // Refetch events after successful update
          eventsRefetch();
        } catch (error) {
          console.error("Error updating event:", error);
        }
      }
    }
  };

  // TODO: Prevent grid height from exceeding 48 rows (30 minutes per row)
  // See https://github.com/react-grid-layout/react-grid-layout/issues/1104 - CefBoud's comment from 2021-04-27

  return (
    <div className="schedule-container-jg grid-container-background-jg">
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 6, sm: 6, xs: 6, xxs: 6 }}
        compactType={null}
        draggableCancel=".widget-prevent-drag-wf"
        autoSize={false}
        rowHeight={30}
        containerPadding={[5, 5]}
        margin={[5, 10]}
        resizeHandles={["n", "s"]}
        onDragStop={handleEventChange}
        onResizeStop={handleEventChange}
      >
        {events.map((event) => {
          // Calculate the size and position based on start time and duration
          const eventStartTime = new Date(event.eventStart);
          const startTimeMinutes =
            eventStartTime.getHours() * 60 + eventStartTime.getMinutes();
          const eventEndTime = new Date(event.eventEnd);
          const durationMinutes = (eventEndTime - eventStartTime) / (1000 * 60);
          const size = Math.ceil(durationMinutes / 30);
          let position = Math.ceil(startTimeMinutes / 30);

          // Check if the event starts on the previous day and ends on the selectedDate
          const startsPreviousDay =
            eventStartTime.getDate() < displayDate.getDate();
          const endsOnSelectedDate =
            eventEndTime.getDate() === displayDate.getDate();

          // Check if the event starts on the selectedDate and ends on the next day
          const startsOnSelectedDate =
            eventStartTime.getDate() === displayDate.getDate();
          const endsNextDay = eventEndTime.getDate() > displayDate.getDate();

          // Calculate the adjusted size based on the time within the selected day
          let adjustedSize = size;

          const nextDay = new Date(displayDate);
          nextDay.setDate(displayDate.getDate() + 1);

          if (startsPreviousDay && endsOnSelectedDate) {
            // Adjust the size based on the time on the selected day
            const minutesOnSelectedDay =
              (new Date(displayDate) - eventStartTime) / (1000 * 60);
            adjustedSize = Math.min(
              adjustedSize,
              Math.ceil(minutesOnSelectedDay / 30)
            );
            position = 0;
          } else if (startsOnSelectedDate && endsNextDay) {
            console.log("[Schedule.jsx] eventEndTime:", eventEndTime);
            console.log("[Schedule.jsx] nextDay:", nextDay);
            // Adjust the size based on the time on the selected day
            const minutesOnSelectedDay =
              (nextDay - eventStartTime) / (1000 * 60);
            console.log(
              "[Schedule.jsx] minutesOnSelectedDay:",
              minutesOnSelectedDay
            );
            adjustedSize = Math.min(
              adjustedSize,
              Math.ceil(minutesOnSelectedDay / 30)
            );
          }

          console.log("[Schedule.jsx] event:", event);
          console.log(
            "[Schedule.jsx] startsPreviousDay && endsOnSelectedDate?:",
            startsPreviousDay && endsOnSelectedDate
          );
          console.log(
            "[Schedule.jsx] startsOnSelectedDate && endsNextDay?:",
            startsOnSelectedDate && endsNextDay
          );
          console.log("[Schedule.jsx] adjustedSize:", adjustedSize);

          let className = "schedule-event-box-jg";

          if (event.type === "work") {
            className += " schedule-event-box-work-jg";
            if (startsPreviousDay && endsOnSelectedDate) {
              className += " schedule-event-box-work-previous-day-jg";
            } else if (startsOnSelectedDate && endsNextDay) {
              className += " schedule-event-box-work-next-day-jg";
            }
          } else {
            className += " schedule-event-box-life-jg";
            if (startsPreviousDay && endsOnSelectedDate) {
              className += " schedule-event-box-life-previous-day-jg";
            } else if (startsOnSelectedDate && endsNextDay) {
              className += " schedule-event-box-life-next-day-jg";
            }
          }

          return (
            <div
              key={event._id}
              id={event._id}
              className={className}
              data-grid={{ w: 6, h: adjustedSize, x: 0, y: position }}
            >
              <p
                className="schedule-event-name-jg widget-prevent-drag-wf"
                onClick={() => handleEventClick(event)}
              >
                {formatTime(new Date(event.eventStart))} - {event.title}
              </p>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Schedule;
