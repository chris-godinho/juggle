// Schedule.jsx

import { useMutation } from "@apollo/client";

import { useModal } from "../contextproviders/ModalProvider.jsx";
import EventDetails from "../dashboard/EventDetails.jsx";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

import { UPDATE_EVENT } from "../../utils/mutations.js";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const Schedule = ({
  events,
  selectedDate,
  eventSubtypes,
  eventsRefetch,
  hiddenAnchor,
}) => {
  const { openModal } = useModal();

  const [updateEvent] = useMutation(UPDATE_EVENT);

  let generatedLayout = [];
  let responsiveLayout = {};
  let eventBoxProps = [];

  const displayDate = new Date(selectedDate);
  displayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(displayDate);
  tomorrowDate.setDate(displayDate.getDate() + 1);

  const assignClassNames = (
    event,
    startsPreviousDay,
    endsOnSelectedDate,
    startsOnSelectedDate,
    endsNextDay
  ) => {
    let className = "schedule-event-box-jg";

    if (event.type === "work") {
      className += " schedule-event-box-work-jg";
      if (startsPreviousDay && endsOnSelectedDate) {
        className += " schedule-event-box-work-previous-day-jg";
      } else if (startsOnSelectedDate && endsNextDay) {
        console.log("[Schedule.jsx] startsOnSelectedDate && endsNextDay");
        console.log("[Schedule.jsx] tomorrowDate:", tomorrowDate.toISOString());
        console.log("[Schedule.jsx] event.eventEnd:", event.eventEnd);
        if (event.eventEnd !== tomorrowDate.toISOString()) {
          className += " schedule-event-box-work-next-day-jg";
        }
      } else if (startsPreviousDay && endsNextDay) {
        className += " schedule-event-box-work-prev-next-day-jg";
      }
    } else {
      className += " schedule-event-box-life-jg";
      if (startsPreviousDay && endsOnSelectedDate) {
        className += " schedule-event-box-life-previous-day-jg";
      } else if (startsOnSelectedDate && endsNextDay) {
        className += " schedule-event-box-life-next-day-jg";
      } else if (startsPreviousDay && endsNextDay) {
        className += " schedule-event-box-life-prev-next-day-jg";
      }
    }

    return className;
  };

  const adjustOverlappingEvents = (layout) => {
    console.log("[Schedule.jsx] adjustOverlappingEvents");
    console.log("[Schedule.jsx] layout:", JSON.stringify(layout));

    // Save current layout to a new array
    const adjustedLayout = [...layout];
    let isUpdated = false;

    // Function to update the layout of an event if necessary
    const updateEventLayout = (eventToUpdate, newW, newX) => {
      console.log("[Schedule.jsx] updateEventLayout");
      console.log("[Schedule.jsx] eventToUpdate:", eventToUpdate);
      console.log("[Schedule.jsx] newW:", newW);
      console.log("[Schedule.jsx] newX:", newX);

      const eventIndex = adjustedLayout.findIndex(
        (event) => event.i === eventToUpdate.i
      );

      adjustedLayout[eventIndex].w = newW;
      adjustedLayout[eventIndex].x = newX;

      isUpdated = true;

      console.log(
        "[Schedule.jsx] adjustedLayout:",
        JSON.stringify(adjustedLayout)
      );
    };

    // Iterate through each event in the layout
    for (let i = 0; i < adjustedLayout.length; i++) {
      const currentEvent = adjustedLayout[i];
      const currentOverlappingEvents = [];

      console.log("[Schedule.jsx] currentEvent:", currentEvent);

      // Compare the current event with each other event in the layout
      for (let j = i + 1; j < adjustedLayout.length; j++) {
        const otherEvent = adjustedLayout[j];

        console.log("[Schedule.jsx] otherEvent:", otherEvent);

        // Check if there is a vertical overlap between the current event and the other event
        const verticalOverlap =
          currentEvent.y < otherEvent.y + otherEvent.h &&
          currentEvent.y + currentEvent.h > otherEvent.y &&
          currentEvent.i !== otherEvent.i;

        // If there is a vertical overlap, add the other event to the list of overlapping events
        if (verticalOverlap) {
          console.log("[Schedule.jsx] Vertical overlap found!");
          currentOverlappingEvents.push(otherEvent);
        }
      }

      // Adjust the layout of the current event based on the number of overlapping events
      if (currentOverlappingEvents.length === 1) {
        console.log("[Schedule.jsx] currentOverlappingEvents.length === 1");
        updateEventLayout(currentEvent, 3, 3);
        updateEventLayout(currentOverlappingEvents[0], 3, 0);
      } else if (currentOverlappingEvents.length === 2) {
        console.log("[Schedule.jsx] currentOverlappingEvents.length === 2");
        updateEventLayout(currentEvent, 2, 4);
        updateEventLayout(currentOverlappingEvents[0], 2, 0);
        updateEventLayout(currentOverlappingEvents[1], 2, 2);
      } else if (currentOverlappingEvents.length === 3) {
        console.log("[Schedule.jsx] currentOverlappingEvents.length === 3");
        updateEventLayout(currentEvent, 1, 5);
        updateEventLayout(currentOverlappingEvents[0], 2, 0);
        updateEventLayout(currentOverlappingEvents[1], 2, 2);
        updateEventLayout(currentOverlappingEvents[2], 1, 4);
      } else if (currentOverlappingEvents.length === 4) {
        console.log("[Schedule.jsx] currentOverlappingEvents.length === 4");
        updateEventLayout(currentEvent, 1, 5);
        updateEventLayout(currentOverlappingEvents[0], 2, 0);
        updateEventLayout(currentOverlappingEvents[1], 1, 2);
        updateEventLayout(currentOverlappingEvents[2], 1, 3);
        updateEventLayout(currentOverlappingEvents[3], 1, 4);
      } else if (currentOverlappingEvents.length === 5) {
        console.log("[Schedule.jsx] currentOverlappingEvents.length === 5");
        updateEventLayout(currentEvent, 1, 5);
        updateEventLayout(currentOverlappingEvents[0], 1, 0);
        updateEventLayout(currentOverlappingEvents[1], 1, 1);
        updateEventLayout(currentOverlappingEvents[2], 1, 2);
        updateEventLayout(currentOverlappingEvents[3], 1, 3);
        updateEventLayout(currentOverlappingEvents[4], 1, 4);
      }

      if (isUpdated) {
        // If the layout was updated, break out of the loop and start over
        console.log("[Schedule.jsx] Layout updated, restarting loop...");
        break;
      }
    }

    return adjustedLayout;
  };

  const buildLayout = (events) => {
    const initialLayout = [];
    events.map((event) => {
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
        console.log("[Schedule.jsx] startsPreviousDay && endsOnSelectedDate");
        console.log("[Schedule.jsx] displayDate:", displayDate);
        console.log("[Schedule.jsx] eventStartTime:", eventStartTime);
        // Adjust the size based on the time on the selected day
        const minutesOnSelectedDay =
          (eventEndTime - new Date(displayDate)) / (1000 * 60);
        console.log(
          "[Schedule.jsx] minutesOnSelectedDay:",
          minutesOnSelectedDay
        );
        adjustedSize = Math.min(
          adjustedSize,
          Math.ceil(minutesOnSelectedDay / 30)
        );
        console.log("[Schedule.jsx] adjustedSize:", adjustedSize);
        position = 0;
      } else if (startsOnSelectedDate && endsNextDay) {
        console.log("[Schedule.jsx] startsOnSelectedDate && endsNextDay");
        const minutesOnSelectedDay = (nextDay - eventStartTime) / (1000 * 60);
        adjustedSize = Math.min(
          adjustedSize,
          Math.ceil(minutesOnSelectedDay / 30)
        );
      } else if (startsPreviousDay && endsNextDay) {
        console.log("[Schedule.jsx] startsPreviousDay && endsNextDay");
        adjustedSize = 48;
        position = 0;
      }

      const className = assignClassNames(
        event,
        startsPreviousDay,
        endsOnSelectedDate,
        startsOnSelectedDate,
        endsNextDay
      );

      initialLayout.push({
        i: event._id,
        w: 6,
        h: adjustedSize,
        x: 0,
        y: position,
      });

      eventBoxProps.push({ event, className: className });
    });
    console.log("[Schedule.jsx] initialLayout:", JSON.stringify(initialLayout));
    generatedLayout = adjustOverlappingEvents(initialLayout);
    console.log(
      "[Schedule.jsx] generatedLayout:",
      JSON.stringify(generatedLayout)
    );
    responsiveLayout = {
      lg: generatedLayout,
      md: generatedLayout,
      sm: generatedLayout,
      xs: generatedLayout,
      xxs: generatedLayout,
    };
  };

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

  const handleDragStop = (layout) => {
    console.log("[Schedule.jsx] handleDragStop");

    // Adjust overlapping events before handling the change
    const adjustedLayout = adjustOverlappingEvents(layout);

    handleEventChange(adjustedLayout);

    generatedLayout = adjustedLayout;
    responsiveLayout = {
      lg: generatedLayout,
      md: generatedLayout,
      sm: generatedLayout,
      xs: generatedLayout,
      xxs: generatedLayout,
    };
  };

  const handleResizeStop = (layout) => {
    console.log("[Schedule.jsx] handleResizeStop");

    // Adjust overlapping events before handling the change
    const adjustedLayout = adjustOverlappingEvents(layout);

    handleEventChange(adjustedLayout);

    generatedLayout = adjustedLayout;
    responsiveLayout = {
      lg: generatedLayout,
      md: generatedLayout,
      sm: generatedLayout,
      xs: generatedLayout,
      xxs: generatedLayout,
    };
  };

  buildLayout(events);

  return (
    <div className="schedule-container-jg grid-container-background-jg">
      <div id="schedule-hidden-anchor-jg" ref={hiddenAnchor}></div>
      <ResponsiveGridLayout
        className="layout"
        layouts={responsiveLayout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 6, md: 6, sm: 6, xs: 6, xxs: 6 }}
        compactType={null}
        draggableCancel=".widget-prevent-drag-wf"
        autoSize={false}
        rowHeight={30}
        containerPadding={[5, 5]}
        margin={[5, 10]}
        resizeHandles={["n", "s"]}
        allowOverlap={true}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
      >
        {events.map((event) => {
          console.log("[Schedule.jsx] event:", event);

          const matchingProp = eventBoxProps.find(
            (eventBoxProp) => eventBoxProp.event._id === event._id
          );

          console.log("[Schedule.jsx] matchingProp:", matchingProp);

          const className = matchingProp ? matchingProp.className : "";

          return (
            <div
              key={event._id}
              id={event._id}
              title={`${formatTime(new Date(event.eventStart))} - ${
                event.title
              }`}
              className={className}
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
