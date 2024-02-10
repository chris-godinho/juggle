// scheduleUtils.js

import { removeTypename, weekdayList } from "./helpers";

// Function to assign class names to each event box according to the event type and time
const assignClassNames = (
  event,
  startsPreviousDay,
  endsOnSelectedDate,
  startsOnSelectedDate,
  endsNextDay,
  nextDay
) => {

  let eventEndTime;
  if (event.eventEnd) {
    eventEndTime = new Date(event.eventEnd);
  }

  const midnightNextDayTime = new Date(nextDay);
  const eventPriority = event.priority.toLowerCase();

  // Assign basic event box class name
  let className = "schedule-event-box-jg";

  // Add additional class names based on event type and priority
  className += ` schedule-event-${eventPriority}-box-${event.type}-jg`;

  // Add additional class names based on event type and time
  if (!event.eventEnd) {
    className += ` schedule-event-box-open-jg schedule-event-${eventPriority}-box-${event.type}-open-jg`;
  } else if (startsPreviousDay && endsOnSelectedDate) {
    className += ` schedule-event-box-previous-day-jg schedule-event-${eventPriority}-box-${event.type}-previous-day-jg`;
  } else if (
    startsOnSelectedDate &&
    endsNextDay &&
    eventEndTime > midnightNextDayTime
  ) {
    className += ` schedule-event-box-next-day-jg schedule-event-${eventPriority}-box-${event.type}-next-day-jg`;
  } else if (startsPreviousDay && endsNextDay) {
    className += ` schedule-event-box-prev-next-day-jg schedule-event-${eventPriority}-box-${event.type}-prev-next-day-jg`;
  }

  // Add additional class names based on event completion status
  if (event.completed) {
    className += " schedule-event-box-completed-jg";
  }

  return className;
};

export const adjustOverlappingEvents = (layout) => {
  console.log("[Schedule.jsx] in adjustOverlappingEvents()");
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

export const buildEventBox = (event, displayDate) => {
  const nextDay = new Date(displayDate);
  nextDay.setDate(displayDate.getDate() + 1);

  let eventStartTime,
    startTimeMinutes,
    eventEndTime,
    durationMinutes,
    adjustedBoxPosition,
    size,
    startsPreviousDay,
    endsOnSelectedDate,
    startsOnSelectedDate,
    endsNextDay,
    adjustedBoxHeight;

  // Calculate the size and position based on start time and duration
  eventStartTime = new Date(event.eventStart);
  console.log("[scheduleUtils.js] buildEventBox()");
  console.log("[scheduleUtils.js] event.eventStart:", event.eventStart);
  console.log("[scheduleUtils.js] eventStartTime:", eventStartTime);
  startTimeMinutes =
    eventStartTime.getHours() * 60 + eventStartTime.getMinutes();
  adjustedBoxPosition = Math.ceil(startTimeMinutes / 30);

  if (event.eventEnd) {
    eventEndTime = new Date(event.eventEnd);
    console.log("[scheduleUtils.js] event.eventEnd:", event.eventEnd);
    console.log("[scheduleUtils.js] eventEndTime:", eventEndTime);
    durationMinutes = (eventEndTime - eventStartTime) / (1000 * 60);
    size = Math.ceil(durationMinutes / 30);

    // Check if the event starts on the previous day and ends on the selectedDate
    startsPreviousDay = eventStartTime.getDate() < displayDate.getDate();
    endsOnSelectedDate = eventEndTime.getDate() === displayDate.getDate();

    // Check if the event starts on the selectedDate and ends on the next day
    startsOnSelectedDate = eventStartTime.getDate() === displayDate.getDate();
    endsNextDay = eventEndTime.getDate() > displayDate.getDate();

    // Calculate the adjusted size based on the time within the selected day
    adjustedBoxHeight = size;

    if (startsPreviousDay && endsOnSelectedDate) {
      // Adjust the size based on the amount of event time on the selected day
      const minutesOnSelectedDay =
        (eventEndTime - new Date(displayDate)) / (1000 * 60);
      adjustedBoxHeight = Math.min(
        adjustedBoxHeight,
        Math.ceil(minutesOnSelectedDay / 30)
      );
      // Adjust the position to start at the beginning of the selected day
      adjustedBoxPosition = 0;
    } else if (startsOnSelectedDate && endsNextDay) {
      // Adjust the size based on the amount of event time on the selected day
      const minutesOnSelectedDay = (nextDay - eventStartTime) / (1000 * 60);
      adjustedBoxHeight = Math.min(
        adjustedBoxHeight,
        Math.ceil(minutesOnSelectedDay / 30)
      );
    } else if (startsPreviousDay && endsNextDay) {
      // Adjust the size of events that start on a previous date and end on a future date
      adjustedBoxHeight = 48;
      adjustedBoxPosition = 0;
    }
  } else {
    adjustedBoxHeight = 1;
  }

  // Assign class names to each event box
  const className = assignClassNames(
    event,
    startsPreviousDay,
    endsOnSelectedDate,
    startsOnSelectedDate,
    endsNextDay,
    nextDay
  );

  return { adjustedBoxHeight, adjustedBoxPosition, className };
};

export const calculateSleepingHoursForDay = (fetchedSettings, selectedDate) => {

  const sleepingHoursMatrix = fetchedSettings?.sleepingHours || {};

  const filteredSleepingHoursMatrix = removeTypename(sleepingHoursMatrix);

  const selectedWeekday = weekdayList[selectedDate.getDay()];
  let selectedStartTime;
  let selectedEndTime;

  if (filteredSleepingHoursMatrix[selectedWeekday]) {
    const { start, end } = filteredSleepingHoursMatrix[selectedWeekday];

    // Convert start and end times to Date objects
    selectedStartTime = new Date(`January 1, 2022 ${start}`);
    selectedEndTime = new Date(`January 1, 2022 ${end}`);

    // Check if end time is earlier than start time (next day)
    if (selectedEndTime < selectedStartTime) {
      selectedEndTime.setDate(selectedEndTime.getDate() + 1);
      selectedEndTime.setHours(0, 0, 0, 0);
    } else {
      selectedStartTime = null;
      selectedEndTime = null;
    }
  }

  const previousDay = new Date(selectedDate);
  previousDay.setDate(selectedDate.getDate() - 1);

  const previousWeekday = weekdayList[previousDay.getDay()];
  let previousStartTime;
  let previousEndTime;

  if (filteredSleepingHoursMatrix[previousWeekday]) {
    const { start, end } = filteredSleepingHoursMatrix[previousWeekday];

    // Convert start and end times to Date objects
    previousStartTime = new Date(`January 1, 2022 ${start}`);
    previousEndTime = new Date(`January 1, 2022 ${end}`);

    // Check if end time is earlier than start time (next day)
    if (previousEndTime < previousStartTime) {
      previousStartTime.setHours(0, 0, 0, 0);
    }
  }

  return {
    selectedStartTime,
    selectedEndTime,
    previousStartTime,
    previousEndTime,
  };
};

const getTotalMinutes = (dateObject) => {
  return dateObject.getHours() * 60 + dateObject.getMinutes();
};

export const calculateSleepingHoursPixelHeights = (
  fetchedSettings,
  selectedDate
) => {
  const {
    selectedStartTime,
    selectedEndTime,
    previousStartTime,
    previousEndTime,
  } = calculateSleepingHoursForDay(fetchedSettings, selectedDate);

  let firstBlockPixelHeight = null;
  if (getTotalMinutes(previousStartTime) === 0) {
    firstBlockPixelHeight = 1;
  } else {
    firstBlockPixelHeight = (getTotalMinutes(previousStartTime) / 30) * 40;
  }

  let secondBlockPixelHeight = null;
  secondBlockPixelHeight = (getTotalMinutes(previousEndTime) / 30) * 40;

  let thirdBlockPixelHeight = null;
  let fourthBlockPixelHeight = null;
  if (selectedStartTime || selectedEndTime) {
    thirdBlockPixelHeight = (getTotalMinutes(selectedStartTime) / 30) * 40;

    fourthBlockPixelHeight = 1920;
    if (getTotalMinutes(selectedEndTime) !== 0) {
      fourthBlockPixelHeight = (getTotalMinutes(selectedEndTime) / 30) * 40;
    }
  }

  return {
    firstBlockPixelHeight,
    secondBlockPixelHeight,
    thirdBlockPixelHeight,
    fourthBlockPixelHeight,
  };
};

// Function to format the time for display
export const formatTime = (dateObject) => {
  const result = dateObject.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return result;
};
