// TaskList.jsx
// Main dashboard panel for task list view

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";

import { useDataContext } from "../contextproviders/DataContext";
import { useModal } from "../contextproviders/ModalProvider.jsx";

import { UPDATE_EVENT } from "../../utils/mutations.js";

import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import LoadingSpinner from "../other/LoadingSpinner.jsx";
import EventDetails from "../dashboard/EventDetails.jsx";

import { formatTime, buildOrderedTaskList } from "../../utils/scheduleUtils.js";

// Import react-grid-layout styles
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

export default function TaskList({ refreshResponsiveGrid }) {
  const {
    events,
    selectedDate,
    eventSubtypes,
    eventsRefetch,
    scheduleSpinnerStyle,
    fetchedSettings,
    responsiveGridTimestampKey,
  } = useDataContext();

  // Initialize modal context for displaying event details
  const { openModal } = useModal();

  // Initialize updateEvent mutation
  const [updateEvent] = useMutation(UPDATE_EVENT);

  const [isLoading, setIsLoading] = useState(true);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [orderedTaskList, setOrderedTaskList] = useState([]);
  const [isDragUpdate, setIsDragUpdate] = useState(false);

  // Assign taskListOrder numbers to each event in the list
  const assignTaskListOrderNumbers = (eventList) => {
    // Filter out events that don't have a taskListOrder number
    const eventListWithTaskListOrder = eventList
      .filter((event) => typeof event.taskListOrder === "number")
      .sort((a, b) => b.taskListOrder - a.taskListOrder);

    // Set the next taskListOrder number
    let nextTaskListOrder =
      eventListWithTaskListOrder.length > 0
        ? eventListWithTaskListOrder[0].taskListOrder + 1
        : 1;

    const parsedEventList = JSON.parse(JSON.stringify(eventList));

    // If an event doesn't have a taskListOrder number, assign it the next number
    for (const event of parsedEventList) {
      if (typeof event.taskListOrder !== "number") {
        event.taskListOrder = nextTaskListOrder++;
      }
    }

    return parsedEventList;
  };

  // Order tasks by taskListOrder value
  const buildAndUpdateOrderedTaskList = (eventListWithTaskOrderNumbers) => {
    // Build the ordered task list
    const reorderedTaskList = buildOrderedTaskList(
      eventListWithTaskOrderNumbers
    );

    // Update the orderedTaskList state with the new list
    setOrderedTaskList(reorderedTaskList);
  };

  // Update the taskListOrder in the database for each event
  const updateEventsInDatabase = async () => {
    // Update each event in the database
    for (let i = 0; i < orderedTaskList.length; i++) {
      try {
        const { data } = await updateEvent({
          variables: {
            eventId: orderedTaskList[i]._id,
            title: orderedTaskList[i].title,
            taskListOrder: orderedTaskList[i].taskListOrder,
          },
        });

        // After all updates are complete, build the new task layout
        buildNewTaskLayout(orderedTaskList);
      } catch (error) {
        console.error("[TaskList.jsx] Error updating event:", error);
      }
    }
  };

  // Build the new task layout
  const buildNewTaskLayout = (orderedTaskList) => {
    // Build the new task layout using the taskListOrder numbers as y values
    const taskLayout = [];
    for (let i = 0; i < orderedTaskList.length; i++) {
      taskLayout.push({
        i: orderedTaskList[i]._id,
        x: 0,
        y: i,
        w: 1,
        h: 1,
      });
    }

    // Set the currentLayout state with the new layout
    setCurrentLayout(taskLayout);
  };

  // Handle moving a task to a new position
  const handleTaskDragStop = async (layout) => {
    // Set the loading state to true to enable the spinner
    setIsLoading(true);

    // Set the isDragUpdate state to true to prevent the database from being updated more than once
    setIsDragUpdate(true);

    // Get the new task list order numbers from the items' y positions
    const newEvents = events.map((event) => {
      const updatedEvent = layout.find(
        (layoutItem) => layoutItem.i === event._id
      );
      if (updatedEvent) {
        return {
          ...event,
          taskListOrder: updatedEvent.y,
        };
      }
      return event;
    });

    // Rebuild ordered task list
    buildAndUpdateOrderedTaskList(newEvents);
  };

  // Update event when marked/unmarked as completed
  const handleCheckboxChange = async (event) => {
    try {
      const eventId = event.target.name;
      const eventToUpdate = events.find((event) => event._id === eventId);

      // Toggle completed value
      const newCompletedValue = !eventToUpdate.completed;

      // Update event in database
      const { data } = await updateEvent({
        variables: {
          eventId: eventId,
          title: eventToUpdate.title,
          completed: newCompletedValue,
        },
      });

      // Refetch events
      if (data) {
        refreshResponsiveGrid();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle clicking on an event (open event details modal)
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
        eventIsAllDay={event.isAllDay}
        eventReminderTime={event.reminderTime}
        eventCompleted={event.completed}
        eventSubtypes={eventSubtypes}
        eventsRefetch={eventsRefetch}
        showStats={fetchedSettings?.showStats}
        refreshResponsiveGrid={refreshResponsiveGrid}
      />
    );
  };

  // Build the task list layout at component mount or when the selected date changes
  useEffect(() => {
    // Skip rebuilding the task list layout if the hook was triggered by a drag event
    if (!isDragUpdate) {
      setIsLoading(true);
      const eventsWithTaskListOrderNumbers = assignTaskListOrderNumbers(events);
      buildAndUpdateOrderedTaskList(eventsWithTaskListOrderNumbers);
      setIsDragUpdate(false);
    }
  }, [selectedDate, events]);

  // Update database after new taskListOrder numbers are set
  useEffect(() => {
    updateEventsInDatabase();
  }, [orderedTaskList]);

  // Set loading state to false after layout is built
  useEffect(() => {
    setIsLoading(false);
  }, [currentLayout]);

  return (
    <div className="task-list-container-jg">
      <div className="task-list-centered-jg">
        {isLoading && !currentLayout ? (
          <LoadingSpinner
            spinnerStyle={scheduleSpinnerStyle}
            spinnerElWidthHeight="100px"
          />
        ) : (
          <ResponsiveGridLayout
            key={responsiveGridTimestampKey}
            className="layout"
            layouts={{
              lg: currentLayout,
              md: currentLayout,
              sm: currentLayout,
              xs: currentLayout,
              xxs: currentLayout,
            }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }}
            draggableCancel=".prevent-drag-jg"
            draggableHandle=".drag-handle-jg"
            isResizable={false}
            rowHeight={40}
            margin={[5, 10]}
            onDragStop={handleTaskDragStop}
            useCSSTransforms={false}
          >
            {orderedTaskList.map((event) => {
              return (
                <div key={event._id}>
                  <div id={event._id} className="task-list-line-jg">
                    <span className="material-symbols-outlined drag-handle-jg">
                      drag_indicator
                    </span>
                    <label
                      key={`checkbox-${event._id}`}
                      className={`checkbox-jg`}
                    >
                      <input
                        type="checkbox"
                        name={event._id}
                        checked={event.completed || false}
                        onChange={handleCheckboxChange}
                        className="task-list-checkbox-jg"
                      />
                    </label>
                    <p
                      title={`${event.title} ${
                        !event.isAllDay
                          ? `(${formatTime(
                              new Date(event.eventStart)
                            )} - ${formatTime(new Date(event.eventEnd))})`
                          : ""
                      } (${event.subtype})`}
                      id={event.completed ? "task-strikethrough-jg" : ""}
                      className={`task-name-jg task-name-${
                        event.type
                      }-${event.priority.toLowerCase()}-jg ${
                        event.completed ? "task-completed-jg" : ""
                      }`}
                      onClick={() => handleEventClick(event)}
                    >
                      {event.title}{" "}
                      <span className="task-details-jg">
                        {!event.isAllDay
                          ? "(" +
                            formatTime(new Date(event.eventStart)) +
                            " - " +
                            formatTime(new Date(event.eventEnd)) +
                            ")"
                          : ""}{" "}
                        ({event.subtype})
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </ResponsiveGridLayout>
        )}
      </div>
    </div>
  );
}
