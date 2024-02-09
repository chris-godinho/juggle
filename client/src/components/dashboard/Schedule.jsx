// Schedule.jsx

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { useDataContext } from "../contextproviders/DataContext"
import { useModal } from "../contextproviders/ModalProvider.jsx";

import { UPDATE_EVENT } from "../../utils/mutations.js";

import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import LoadingSpinner from "../other/LoadingSpinner.jsx";
import EventDetails from "../dashboard/EventDetails.jsx";

import { adjustOverlappingEvents, buildEventBox, formatTime } from "../../utils/scheduleUtils.js";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const Schedule = () => {
  console.log("[Schedule.jsx] rendering...");

  const { events, selectedDate, eventSubtypes, eventsRefetch, scheduleSpinnerStyle, fetchedSettings } = useDataContext();

  // Initialize the modal context for displaying event details
  const { openModal } = useModal();

  // Initialize the updateEvent mutation
  const [updateEvent] = useMutation(UPDATE_EVENT);

  const [isLoading, setIsLoading] = useState(true);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [eventBoxProps, setEventBoxProps] = useState([]);

  // Initialize variables for the selected date and the next day
  const displayDate = new Date(selectedDate);
  displayDate.setHours(0, 0, 0, 0);
  const tomorrowDate = new Date(displayDate);
  tomorrowDate.setDate(displayDate.getDate() + 1);

  // Function to build the initial layout
  const buildLayout = (events) => {
    const initialLayout = [];
    events.map((event) => {
      const { adjustedBoxHeight, adjustedBoxPosition, className } = buildEventBox(event, displayDate);

      // Add the event to the initial layout
      initialLayout.push({
        i: event._id,
        w: 6,
        h: adjustedBoxHeight,
        x: 0,
        y: adjustedBoxPosition,
      });

      // Add the event to the event box props for future reference
      setEventBoxProps((prevEventBoxProps) => [
        ...prevEventBoxProps,
        { event, className },
      ]);
    });
    // Adjust overlapping events before setting the layout
    setCurrentLayout(adjustOverlappingEvents(initialLayout));
  };

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
        showStats={fetchedSettings?.showStats}
      />
    );
  };

  // Function to handle changes to the event layout
  const handleEventChange = async (layout) => {
    console.log("[Schedule.jsx] in handleEventChange()");
    // Iterate through each moved event
    for (const movedEvent of layout) {
      const eventId = movedEvent.i;

      // Find the corresponding event in the events array
      const eventToUpdate = events.find((event) => event._id === eventId);

      if (eventToUpdate) {
        // Calculate new start time and duration based on the moved layout
        const newStartTimeMinutes = movedEvent.y * 30; // Each row represents 30 minutes
        const newEndTimeMinutes = newStartTimeMinutes + movedEvent.h * 30;

        const updatedEventStart = new Date(selectedDate);
        const updatedEventEnd = new Date(selectedDate);

        // Add minutes to the start and end times
        updatedEventStart.setMinutes(newStartTimeMinutes);
        updatedEventEnd.setMinutes(newEndTimeMinutes);

        // Update the event in the database
        try {
          await updateEvent({
            variables: {
              eventId: eventToUpdate._id,
              title: eventToUpdate.title,
              type: eventToUpdate.type,
              subtype: eventToUpdate.subtype,
              details: eventToUpdate.details,
              eventStart: updatedEventStart,
              eventEnd: updatedEventEnd,
              location: eventToUpdate.location,
              links: eventToUpdate.links,
              files: eventToUpdate.files,
              priority: eventToUpdate.priority,
              setReminder: eventToUpdate.setReminder,
              reminderTime: eventToUpdate.reminderTime,
              completed: eventToUpdate.completed,
            },
          });
        } catch (error) {
          console.error("Error updating event:", error);
        }
      }
    }
  };

  // Function to handle dragging an event
  const handleDragResizeStop = (layout) => {

    // Adjust overlapping events before handling the change
    const adjustedLayout = adjustOverlappingEvents(layout);

    // Update the database with the new layout
    handleEventChange(adjustedLayout);

    // Update the layout variables
    setCurrentLayout(adjustedLayout);
  };

  // Build the initial layout
  useEffect(() => {
    const initializeSchedule = () => {
      setIsLoading(true);
      buildLayout(events);
      setIsLoading(false);
    };

    initializeSchedule();
  }, [events, selectedDate]);

  return (
    <div className="schedule-container-jg grid-container-background-jg">
      {isLoading ? (
        <LoadingSpinner
          spinnerStyle={scheduleSpinnerStyle}
          spinnerElWidthHeight="100px"
        />
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{
            lg: currentLayout,
            md: currentLayout,
            sm: currentLayout,
            xs: currentLayout,
            xxs: currentLayout,
          }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 6, md: 6, sm: 6, xs: 6, xxs: 6 }}
          compactType={null}
          draggableCancel=".widget-prevent-drag-wf"
          autoSize={false}
          rowHeight={30}
          maxRows={48}
          containerPadding={[10, 5]}
          margin={[5, 10]}
          resizeHandles={["n", "s"]}
          allowOverlap={true}
          onDragStop={handleDragResizeStop}
          onResizeStop={handleDragResizeStop}
        >
          {events.map((event) => {

            const matchingProp = eventBoxProps.find(
              (eventBoxProp) => eventBoxProp.event._id === event._id
            );

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
      )}
    </div>
  );
};

export default Schedule;
