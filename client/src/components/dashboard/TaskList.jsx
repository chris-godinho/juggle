// TaskList.jsx

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";

import { useDataContext } from "../contextproviders/DataContext";
import { useModal } from "../contextproviders/ModalProvider.jsx";

import { UPDATE_EVENT } from "../../utils/mutations.js";

import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import LoadingSpinner from "../other/LoadingSpinner.jsx";
import EventDetails from "../dashboard/EventDetails.jsx";

import { formatTime, buildOrderedTaskList } from "../../utils/scheduleUtils.js";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

export default function TaskList({ refreshResponsiveGrid }) {
  console.log("[TaskList.jsx] rendering...");

  // TODO:

  const {
    events,
    selectedDate,
    eventSubtypes,
    eventsRefetch,
    scheduleSpinnerStyle,
    fetchedSettings,
    responsiveGridTimestampKey,
  } = useDataContext();

  // Initialize the modal context for displaying event details
  const { openModal } = useModal();

  // Initialize the updateEvent mutation
  const [updateEvent] = useMutation(UPDATE_EVENT);

  const [isLoading, setIsLoading] = useState(true);
  const [currentLayout, setCurrentLayout] = useState([]);
  const [orderedTaskList, setOrderedTaskList] = useState([]);

  const assignTaskListOrderNumbers = (eventList) => {
    // Assign taskListOrder numbers to each event in the list

    const eventListWithTaskListOrder = eventList
      .filter((event) => typeof event.taskListOrder === "number")
      .sort((a, b) => b.taskListOrder - a.taskListOrder);

    let nextTaskListOrder =
      eventListWithTaskListOrder.length > 0
        ? eventListWithTaskListOrder[0].taskListOrder + 1
        : 1;

    // Some events might not have one
    for (const event of eventList) {
      if (typeof event.taskListOrder !== "number") {
        event.taskListOrder = nextTaskListOrder++;
      }
    }

    return eventList;
  };

  const buildAndUpdateOrderedTaskList = (eventListWithTaskOrderNumbers) => {
    // Order the list of events by taskListOrder
    console.log(
      "[TaskList.jsx] in buildAndUpdateOrderedTaskList() - eventListWithTaskOrderNumbers:",
      eventListWithTaskOrderNumbers
    );
    const reorderedTaskList = buildOrderedTaskList(
      eventListWithTaskOrderNumbers
    );
    console.log(
      "[TaskList.jsx] buildAndUpdateOrderedTaskList() - reorderedTaskList:",
      reorderedTaskList
    );
    // Update the orderedTaskList state with the new list
    setOrderedTaskList(reorderedTaskList);
  };

  const updateEventsInDatabase = async (eventListWithTaskOrderNumbers) => {
    // This will update the taskListOrder in the database for each event
    console.log(
      "[TaskList.jsx] in updateEventsInDatabase() - eventListWithTaskOrderNumbers:",
      eventListWithTaskOrderNumbers
    );

    for (let i = 0; i < eventListWithTaskOrderNumbers.length; i++) {
      try {
        const { data } = await updateEvent({
          variables: {
            eventId: eventListWithTaskOrderNumbers[i]._id,
            title: eventListWithTaskOrderNumbers[i].title,
            taskListOrder: eventListWithTaskOrderNumbers[i].taskListOrder,
          },
        });
        // Handle success or log appropriately
      } catch (error) {
        console.error("[TaskList.jsx] Error updating event:", error);
        // Handle error appropriately
      }
    }
  };

  const buildNewTaskLayout = (orderedTaskList) => {
    console.log(
      "[TaskList.jsx] in buildNewTaskLayout() - orderedTaskList:",
      orderedTaskList
    );
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
    setCurrentLayout(taskLayout);
    setIsLoading(false);
  };

  const updateEventsTaskListOrder = async (updatedEvents) => {
    console.log("[TaskList.jsx] in updateEventsTaskListOrder()");

    for (let i = 0; i < updatedEvents.length; i++) {
      try {
        const { data } = await updateEvent({
          variables: {
            eventId: updatedEvents[i]._id,
            title: updatedEvents[i].title,
            taskListOrder: updatedEvents[i].taskListOrder,
          },
        });
        // Handle success or log appropriately
      } catch (error) {
        console.error("[TaskList.jsx] Error updating event:", error);
        // Handle error appropriately
      }
    }
  };

  const buildTaskList = async (events) => {
    console.log("[TaskList.jsx] in buildTaskList()");
    try {
      const reorderedTaskList = buildOrderedTaskList(events);
      console.log("[TaskList.jsx] Reordered Task List:", reorderedTaskList);
      setOrderedTaskList(reorderedTaskList);

      const updatedEvents = events.map((event) => {
        const updatedEvent = orderedTaskList.find(
          (orderedEvent) => orderedEvent._id === event._id
        );

        // Create a new object to avoid modifying the object in orderedTaskList
        if (updatedEvent) {
          return {
            ...updatedEvent,
            taskListOrder: orderedTaskList.indexOf(updatedEvent),
          };
        }

        return event; // Return the original event if not found in orderedTaskList
      });

      console.log(
        "[TaskList.jsx] updateEventsTaskListOrder() - updatedEvents: ",
        updatedEvents
      );

      updateEventsTaskListOrder(updatedEvents);

      refreshResponsiveGrid("initial");
    } catch (error) {
      console.error("[TaskList.jsx] Error building task list:", error);
    }
  };

  const buildTaskLayout = () => {
    console.log("[TaskList.jsx] in buildTaskLayout()");
    console.log("[TaskList.jsx] orderedTaskList:", orderedTaskList);
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
    console.log("[TaskList.jsx] Task Layout:", taskLayout);
    setCurrentLayout(taskLayout);
    setIsLoading(false);
  };

  const handleTaskDragStop = async (
    layout,
    oldItem,
    newItem,
    placeholder,
    e
  ) => {
    console.log("[TaskList.jsx] handleTaskDragStop() - layout:", layout);

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

    console.log("[TaskList.jsx] handleTaskDragStop() - newEvents:", newEvents);

    const reorderedTaskList = buildOrderedTaskList(newEvents);
    console.log("[TaskList.jsx] Reordered Task List:", reorderedTaskList);
    setOrderedTaskList(reorderedTaskList);

    updateEventsTaskListOrder(newEvents);
  };

  const handleCheckboxChange = async (event) => {
    try {
      const eventId = event.target.name;
      const eventToUpdate = events.find((event) => event._id === eventId);
      const newCompletedValue = !eventToUpdate.completed;

      console.log("[TaskList.jsx] handleCheckboxChange() - eventId: ", eventId);
      console.log(
        "[TaskList.jsx] handleCheckboxChange() - eventToUpdate: ",
        eventToUpdate
      );
      console.log(
        "[TaskList.jsx] handleCheckboxChange() - newCompletedValue: ",
        newCompletedValue
      );

      const { data } = await updateEvent({
        variables: {
          eventId: eventId,
          title: eventToUpdate.title,
          completed: newCompletedValue,
        },
      });

      if (data) {
        refreshResponsiveGrid();
      }
    } catch (error) {
      console.error(error);
    }
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

  // Build the task list
  useEffect(() => {
    console.log("[TaskList.jsx] in useEffect() (selectedDate has changed)...");
    const initializeTaskList = () => {
      setIsLoading(true);
      buildTaskList(events);
    };

    initializeTaskList();
  }, [selectedDate, events]);

  useEffect(() => {
    console.log("[TaskList.jsx] in useEffect() (Ordered task list changed)...");
    console.log("[TaskList.jsx] orderedTaskList:", orderedTaskList);
    buildTaskLayout();
  }, [orderedTaskList]);

  useEffect(() => {
    console.log("[TaskList.jsx] in useEffect() (currentLayout changed)...");
    console.log("[TaskList.jsx] currentLayout:", currentLayout);
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
                      {!event.isAllDay
                        ? "(" +
                          formatTime(new Date(event.eventStart)) +
                          " - " +
                          formatTime(new Date(event.eventEnd)) +
                          ")"
                        : ""}{" "}
                      ({event.subtype})
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
