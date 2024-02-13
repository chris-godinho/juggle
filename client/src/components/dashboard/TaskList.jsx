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
  const [isDragUpdate, setIsDragUpdate] = useState(false);

  const assignTaskListOrderNumbers = (eventList) => {
    // Assign taskListOrder numbers to each event in the list

    console.log(
      "[TaskList.jsx] in assignTaskListOrderNumbers() - eventList:",
      eventList
    );

    const eventListWithTaskListOrder = eventList
      .filter((event) => typeof event.taskListOrder === "number")
      .sort((a, b) => b.taskListOrder - a.taskListOrder);

    let nextTaskListOrder =
      eventListWithTaskListOrder.length > 0
        ? eventListWithTaskListOrder[0].taskListOrder + 1
        : 1;

    const parsedEventList = JSON.parse(JSON.stringify(eventList));

    // Some events might not have one
    for (const event of parsedEventList) {
      if (typeof event.taskListOrder !== "number") {
        event.taskListOrder = nextTaskListOrder++;
      }
    }

    console.log(
      "[TaskList.jsx] assignTaskListOrderNumbers() - parsedEventList:",
      parsedEventList
    );

    return parsedEventList;
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
    // Update the orderedTaskList state with the new list
    setOrderedTaskList(reorderedTaskList);
  };

  const updateEventsInDatabase = async () => {
    // This will update the taskListOrder in the database for each event
    console.log("[TaskList.jsx] in updateEventsInDatabase()");

    for (let i = 0; i < orderedTaskList.length; i++) {
      try {
        const { data } = await updateEvent({
          variables: {
            eventId: orderedTaskList[i]._id,
            title: orderedTaskList[i].title,
            taskListOrder: orderedTaskList[i].taskListOrder,
          },
        });
        // Handle success or log appropriately

        // After all updates are complete, call buildNewTaskLayout
        buildNewTaskLayout(orderedTaskList);
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
  };

  const handleTaskDragStop = async (
    layout,
    oldItem,
    newItem,
    placeholder,
    e
  ) => {
    console.log("[TaskList.jsx] handleTaskDragStop() - layout:", layout);

    setIsLoading(true);
    setIsDragUpdate(true);

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

    buildAndUpdateOrderedTaskList(newEvents);
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
    if (!isDragUpdate) {
      setIsLoading(true);
      const eventsWithTaskListOrderNumbers = assignTaskListOrderNumbers(events);
      buildAndUpdateOrderedTaskList(eventsWithTaskListOrderNumbers);
      setIsDragUpdate(false);
    }
  }, [selectedDate, events]);

  useEffect(() => {
    console.log("[TaskList.jsx] in useEffect() (Ordered task list changed)...");
    console.log("[TaskList.jsx] orderedTaskList:", orderedTaskList);
    updateEventsInDatabase();
  }, [orderedTaskList]);

  useEffect(() => {
    console.log("[TaskList.jsx] in useEffect() (currentLayout changed)...");
    console.log("[TaskList.jsx] currentLayout:", currentLayout);
    setIsLoading(false);
  }, [currentLayout]);

  useEffect(() => {
    console.log(
      "[TaskList.jsx] in useEffect() isDragUpdate has been changed to:",
      isDragUpdate
    );
  }, [isDragUpdate]);

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
