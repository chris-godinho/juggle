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
  // Initialize the modal context for displaying event details
  const { openModal } = useModal();

  // Initialize the updateEvent mutation
  const [updateEvent] = useMutation(UPDATE_EVENT);

  // Initialize variables for the layout
  // TODO: Are there too many variables here?
  let generatedLayout = [];
  let responsiveLayout = {};
  let eventBoxProps = [];

  // Initialize variables for the selected date and the next day
  const displayDate = new Date(selectedDate);
  displayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(displayDate);
  tomorrowDate.setDate(displayDate.getDate() + 1);

  // Function to assign class names to each event box according to the event type and time
  const assignClassNames = (
    event,
    startsPreviousDay,
    endsOnSelectedDate,
    startsOnSelectedDate,
    endsNextDay
  ) => {
    let className = "schedule-event-box-jg";

    if (event.type === "work") {
      // Assign basic work event styles
      className += " schedule-event-box-work-jg";
      if (startsPreviousDay && endsOnSelectedDate) {
        // Assign styles for work events that start on a previous date and end on the selected date
        className += " schedule-event-box-work-previous-day-jg";
      } else if (startsOnSelectedDate && endsNextDay) {
        // Assign styles for work events that start on the selected date and end on a future date
        if (event.eventEnd !== tomorrowDate.toISOString()) {
          // Only assign styles for work events that do not end at midnight
          className += " schedule-event-box-work-next-day-jg";
        }
      } else if (startsPreviousDay && endsNextDay) {
        // Assign styles for work events that start on the previous day and end on the next day
        className += " schedule-event-box-work-prev-next-day-jg";
      }
    } else {
      // Assign basic life event styles
      className += " schedule-event-box-life-jg";
      if (startsPreviousDay && endsOnSelectedDate) {
        // Assign styles for life events that start on a previous date and end on the selected date
        className += " schedule-event-box-life-previous-day-jg";
      } else if (startsOnSelectedDate && endsNextDay) {
        // Assign styles for life events that start on the selected date and end on a future date
        if (event.eventEnd !== tomorrowDate.toISOString()) {
          // Only assign styles for life events that do not end at midnight
          className += " schedule-event-box-life-next-day-jg";
        }
      } else if (startsPreviousDay && endsNextDay) {
        // Assign styles for life events that start on the previous day and end on the next day
        className += " schedule-event-box-life-prev-next-day-jg";
      }
    }

    return className;
  };

  // Function to adjust the layout of overlapping events
  const adjustOverlappingEvents = (layout) => {

    // Save current layout to a new array
    const adjustedLayout = [...layout];
    let isUpdated = false;

    // Function to update the layout of an event if necessary
    const updateEventLayout = (eventToUpdate, newW, newX) => {

      const eventIndex = adjustedLayout.findIndex(
        (event) => event.i === eventToUpdate.i
      );

      adjustedLayout[eventIndex].w = newW;
      adjustedLayout[eventIndex].x = newX;

      isUpdated = true;
    };

    // Iterate through each event in the layout
    for (let i = 0; i < adjustedLayout.length; i++) {
      const currentEvent = adjustedLayout[i];
      const currentOverlappingEvents = [];

      // Compare the current event with each other event in the layout
      for (let j = i + 1; j < adjustedLayout.length; j++) {
        const otherEvent = adjustedLayout[j];

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
        break;
      }
    }

    return adjustedLayout;
  };

  // Function to build the initial layout
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

      // Check if the event starts on the previous day and ends on the selectedDate
      // TODO: Can I just use tomorrowDate instead?
      const nextDay = new Date(displayDate);
      nextDay.setDate(displayDate.getDate() + 1);

      if (startsPreviousDay && endsOnSelectedDate) {
        // Adjust the size based on the amount of event time on the selected day
        const minutesOnSelectedDay =
          (eventEndTime - new Date(displayDate)) / (1000 * 60);
        adjustedSize = Math.min(
          adjustedSize,
          Math.ceil(minutesOnSelectedDay / 30)
        );
        // Adjust the position to start at the beginning of the selected day
        position = 0;
      } else if (startsOnSelectedDate && endsNextDay) {
        // Adjust the size based on the amount of event time on the selected day
        const minutesOnSelectedDay = (nextDay - eventStartTime) / (1000 * 60);
        adjustedSize = Math.min(
          adjustedSize,
          Math.ceil(minutesOnSelectedDay / 30)
        );
      } else if (startsPreviousDay && endsNextDay) {
        // Adjust the size of events that start on a previous date and end on a future date
        adjustedSize = 48;
        position = 0;
      }

      // Assign class names to each event box
      const className = assignClassNames(
        event,
        startsPreviousDay,
        endsOnSelectedDate,
        startsOnSelectedDate,
        endsNextDay
      );

      // Add the event to the initial layout
      initialLayout.push({
        i: event._id,
        w: 6,
        h: adjustedSize,
        x: 0,
        y: position,
      });

      // Add the event to the event box props for future reference
      eventBoxProps.push({ event, className: className });
    });

    // Adjust overlapping events before setting the layout
    generatedLayout = adjustOverlappingEvents(initialLayout);

    // Set the responsive layout in the correct format
    responsiveLayout = {
      lg: generatedLayout,
      md: generatedLayout,
      sm: generatedLayout,
      xs: generatedLayout,
      xxs: generatedLayout,
    };
  };

  // Function to format the time for display
  const formatTime = (dateObject) => {
    const result = dateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return result;
  };

  // Function to check if the layout needs to be reset (when the grid height has been exceeded)
  const checkLayoutReset = (layout) => {
    const newHeight = document.querySelector(".react-grid-layout").offsetHeight;
    if (newHeight > 1921) {
    }
  };

  // Function to save the current layout before dragging or resizing
  const saveCurrentLayouts = (layout) => {};

  // Function to handle clicking on an event (opens the event details modal)
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

  // Function to handle changes to the event layout
  const handleEventChange = async (layout) => {

    // Iterate through each moved event
    for (const movedEvent of layout) {
      const eventId = movedEvent.i;

      // Find the corresponding event in the events array
      const eventToUpdate = events.find((event) => event._id === eventId);

      if (eventToUpdate) {
        // Calculate new start time and duration based on the moved layout
        const newStartTimeMinutes = movedEvent.y * 30; // Assuming each row represents 30 minutes
        const newEndTimeMinutes = newStartTimeMinutes + movedEvent.h * 30;

        // Build the updated event object
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

        // Add minutes to the start and end times
        updatedEvent.eventStart.setMinutes(newStartTimeMinutes);
        updatedEvent.eventEnd.setMinutes(newEndTimeMinutes);

        // Update the event in the database
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

  // Function to handle dragging an event
  const handleDragStop = (layout) => {

    // Adjust overlapping events before handling the change
    const adjustedLayout = adjustOverlappingEvents(layout);

    // Update the database with the new layout
    handleEventChange(adjustedLayout);

    // Update the layout variables
    generatedLayout = adjustedLayout;
    responsiveLayout = {
      lg: generatedLayout,
      md: generatedLayout,
      sm: generatedLayout,
      xs: generatedLayout,
      xxs: generatedLayout,
    };
  };

  // Function to handle resizing an event
  // TODO: Can I combine this with handleDragStop?
  const handleResizeStop = (layout) => {

    // Adjust overlapping events before handling the change
    const adjustedLayout = adjustOverlappingEvents(layout);

    // Update the database with the new layout
    handleEventChange(adjustedLayout);

    // Update the layout variables
    generatedLayout = adjustedLayout;
    responsiveLayout = {
      lg: generatedLayout,
      md: generatedLayout,
      sm: generatedLayout,
      xs: generatedLayout,
      xxs: generatedLayout,
    };
  };

  // Build the initial layout
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
        onDragStart={saveCurrentLayouts}
        onResizeStart={saveCurrentLayouts}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onLayoutChange={checkLayoutReset}
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
