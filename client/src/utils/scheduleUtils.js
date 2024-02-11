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

const findEventW = (event, eventsInLine, receivedLayout) => {
  let newW;

  if (
    eventsInLine.indexOf(event.i) === eventsInLine.length - 1 &&
    eventsInLine.length > 1
  ) {
    let occupiedW = 0;
    for (let i = 0; i < eventsInLine.length; i++) {
      if (event.i !== eventsInLine[i]) {
        const currentEvent = receivedLayout.find(
          (layoutEvent) => layoutEvent.i === eventsInLine[i]
        );
        console.log("[scheduleUtils.js] currentEvent: ", currentEvent);
        console.log("[scheduleUtils.js] currentEvent.w: ", currentEvent.w);
        occupiedW += currentEvent.w;
        newW = 6 - occupiedW;
      }
    }
  } else {
    switch (eventsInLine.length) {
      case 1:
        newW = 6;
        break;
      case 2:
        newW = 3;
        break;
      case 3:
        newW = 2;
        break;
      case 4:
      case 5:
      case 6:
        newW = 1;
        break;
      default:
        newW = event.w;
        break;
    }
  }

  console.log("[scheduleUtils.js] newW: ", newW);

  return newW;
};

const findEventX = (event, eventsInLine, receivedLayout) => {
  let currentX;

  console.log("[scheduleUtils.js] eventsInLine: ", eventsInLine);
  console.log(
    "[scheduleUtils.js] eventsInLine.indexOf(event.i): ",
    eventsInLine.indexOf(event.i)
  );

  switch (eventsInLine.length) {
    case 1:
      console.log("[scheduleUtils.js] Case 1");
      currentX = 0;
      break;
    case 2:
      console.log("[scheduleUtils.js] Case 2");
      currentX = eventsInLine.indexOf(event.i) * 3;
      break;
    case 3:
      console.log("[scheduleUtils.js] Case 3");
      currentX = eventsInLine.indexOf(event.i) * 2;
      break;
    case 4:
    case 5:
    case 6:
      console.log("[scheduleUtils.js] Case 4, 5, 6");
      currentX = eventsInLine.indexOf(event.i);
      break;
    default:
      console.log("[scheduleUtils.js] Default case");
      currentX = event.x;
      break;
  }

  return currentX;
};

export const adjustOverlappingEvents = (receivedLayout, events) => {
  console.log("[scheduleUtils.js] in adjustOverlappingEvents");
  console.log("[scheduleUtils.js] Received layout: ", receivedLayout);

  // Sort by "y" in ascending order, then by "h" in descending order
  receivedLayout.sort((a, b) => {
    // Compare "y" values
    if (a.y !== b.y) {
      return a.y - b.y;
    }

    // If "y" values are equal, compare "h" values in descending order
    return b.h - a.h;
  });

  console.log("[scheduleUtils.js] Sorted layout: ", receivedLayout);

  let layoutBreakdown = [];

  for (let gridLineIndex = 0; gridLineIndex < 48; gridLineIndex++) {
    console.log("[scheduleUtils.js] gridLineIndex: ", gridLineIndex);
    let lineMatches = [];
    for (
      let receivedLayoutIndex = 0;
      receivedLayoutIndex < receivedLayout.length;
      receivedLayoutIndex++
    ) {
      const currentCheckedEvent = receivedLayout[receivedLayoutIndex];

      if (
        gridLineIndex >= currentCheckedEvent.y &&
        gridLineIndex < currentCheckedEvent.y + currentCheckedEvent.h
      ) {
        console.log("[scheduleUtils.js] Match found");
        lineMatches.push(currentCheckedEvent.i);
      }
    }
    console.log("[scheduleUtils.js] lineMatches: ", lineMatches);
    layoutBreakdown.push(lineMatches);
  }

  console.log("[scheduleUtils.js] layoutBreakdown: ", layoutBreakdown);

  for (
    let receivedLayoutIndex = 0;
    receivedLayoutIndex < receivedLayout.length;
    receivedLayoutIndex++
  ) {
    const currentProcessedEvent = receivedLayout[receivedLayoutIndex];

    console.log(
      "[scheduleUtils.js] currentProcessedEvent: ",
      currentProcessedEvent
    );

    let currentW = 6;
    let currentX = 0;
    let currentLineBreakdown = [];

    for (
      let layoutBreakdownIndex = 0;
      layoutBreakdownIndex < layoutBreakdown.length;
      layoutBreakdownIndex++
    ) {
      currentLineBreakdown = layoutBreakdown[layoutBreakdownIndex];

      console.log(
        "[scheduleUtils.js] currentLineBreakdown: ",
        layoutBreakdownIndex,
        currentLineBreakdown
      );

      if (currentLineBreakdown.includes(currentProcessedEvent.i)) {
        console.log(
          "[scheduleUtils.js] currentLineBreakdown includes currentProcessedEvent"
        );
        const newW = findEventW(
          currentProcessedEvent,
          currentLineBreakdown,
          receivedLayout
        );
        console.log("[scheduleUtils.js] newW: ", newW);
        if (newW < currentW) {
          currentW = newW;
          currentX = findEventX(
            currentProcessedEvent,
            currentLineBreakdown,
            receivedLayout
          );
        }
        console.log("[scheduleUtils.js] currentW: ", currentW);
        console.log("[scheduleUtils.js] currentX: ", currentX);
      }
    }

    receivedLayout[receivedLayoutIndex].w = currentW;
    receivedLayout[receivedLayoutIndex].x = currentX;
  }

  console.log("[scheduleUtils.js] Adjusted layout: ", receivedLayout);
  return receivedLayout;
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
  startTimeMinutes =
    eventStartTime.getHours() * 60 + eventStartTime.getMinutes();
  adjustedBoxPosition = Math.ceil(startTimeMinutes / 30);

  if (event.eventEnd) {
    eventEndTime = new Date(event.eventEnd);
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
