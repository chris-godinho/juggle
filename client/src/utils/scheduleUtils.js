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

// Function to update the layout of an event if necessary
const updateEventLayout = (eventToUpdate, newW, newX) => {
  eventToUpdate.w = newW;
  eventToUpdate.x = newX;

  console.log("[scheduleUtils.js] newW: ", newW);
  console.log("[scheduleUtils.js] newX: ", newX);

  const updatedEvent = {
    i: eventToUpdate.i,
    x: newX,
    y: eventToUpdate.y,
    w: newW,
    h: eventToUpdate.h,
  };

  return updatedEvent;
};

const adjustEventLayout = (targetEventForAdjustment, overlapRank) => {
  let newW = targetEventForAdjustment.w;
  let newX = targetEventForAdjustment.x;

  console.log(
    "[scheduleUtils.js] targetEventForAdjustment.overlapCount: ",
    targetEventForAdjustment.overlapCount
  );
  console.log(
    "[scheduleUtils.js] Type of targetEventForAdjustment.overlapCount: ",
    typeof targetEventForAdjustment.overlapCount
  );

  switch (targetEventForAdjustment.overlapCount) {
    case 1:
      console.log(
        "[scheduleUtils.js] Case 1: ",
        targetEventForAdjustment.overlapCount
      );
      newW = 3;
      overlapRank === 1 ? (newX = 0) : (newX = 3);
      break;
    case 2:
      console.log(
        "[scheduleUtils.js] Case 2: ",
        targetEventForAdjustment.overlapCount
      );
      newW = 2;
      overlapRank === 1
        ? (newX = 0)
        : overlapRank === 2
        ? (newX = 2)
        : (newX = 4);
      break;
    case 3:
    case 4:
    case 5:
      console.log(
        "[scheduleUtils.js] Case 3, 4, 5: ",
        targetEventForAdjustment.overlapCount
      );
      newW = 1;
      newX = overlapRank - 1;
      break;
    case 6:
      console.log(
        "[scheduleUtils.js] Case 6: ",
        targetEventForAdjustment.overlapCount
      );
      // TODO: If there are more than 5 overlapping events, what to do?
      break;
    default:
      console.log(
        "[scheduleUtils.js] Default case: ",
        targetEventForAdjustment.overlapCount
      );
      break;
  }

  const updatedEvent = updateEventLayout(targetEventForAdjustment, newW, newX);

  console.log(
    "[scheduleUtils.js] Updated event layout: ",
    JSON.stringify(updatedEvent, null, 2)
  );

  return updatedEvent;
};

export const adjustOverlappingEvents = (receivedLayout, events) => {
  console.log("[scheduleUtils.js] in adjustOverlappingEvents");
  console.log("[scheduleUtils.js] Received layout: ", receivedLayout);

  // Create a copy of the received layout
  let workingLayout = [...receivedLayout];

  // Create an empty array to store the final layout
  let finalLayout = [];

  // Loop through all 48 lines in schedule (y-index)
  for (let line = 0; line < 47; line++) {
    console.log(
      "--------------------------------------------------------------------------------------------------"
    );
    console.log("[scheduleUtils.js] Line: ", line);

    // Create an empty array to store the events that match the current line
    let lineMatches = [];

    // Loop through the working layout and find all events that occupy the current line
    for (let j = 0; j < workingLayout.length; j++) {
      const currentLineCheckedEvent = workingLayout[j];

      const currentLineCheckedEventData = events.find(
        (event) => event._id === currentLineCheckedEvent.i
      );

      console.log(
        "[scheduleUtils.js] Checking if event",
        currentLineCheckedEventData.title,
        "is on line:",
        line
      );

      // Check if the event is on the current line
      if (
        line >= currentLineCheckedEvent.y &&
        line <= currentLineCheckedEvent.y + currentLineCheckedEvent.h - 1
      ) {
        // Event is on this line
        console.log(
          "[scheduleUtils.js] MATCH! Event",
          currentLineCheckedEventData.title,
          "is on line:",
          line
        );
        // Add the event to the line matches array
        lineMatches.push(currentLineCheckedEvent);
      }
    }

    // If there are events on this line, check for overlaps with other events (on any line)
    if (lineMatches.length > 0) {
      // There are events on this line
      console.log(
        "[scheduleUtils.js] There are",
        lineMatches.length,
        "events on line:",
        line
      );

      // Loop through the line matches to check for overlaps
      for (let k = 0; k < lineMatches.length; k++) {
        const currentOverlapCheckedEvent = lineMatches[k];
        lineMatches[k].overlapCount = 0;
        lineMatches[k].overlappingEvents = [];

        const currentOverlapCheckedEventData = events.find(
          (event) => event._id === currentOverlapCheckedEvent.i
        );

        console.log(
          "[scheduleUtils.js] Checking event",
          currentOverlapCheckedEventData.title,
          "for overlaps"
        );

        // Loop through the event list and try to find overlaps with currently checked event
        for (let l = 0; l < receivedLayout.length; l++) {
          const currentOverlapComparedEvent = receivedLayout[l];

          const currentOverlapComparedEventData = events.find(
            (event) => event._id === currentOverlapComparedEvent.i
          );

          // Check for vertical overlap between the two events
          const hasVerticalOverlap =
            currentOverlapCheckedEvent.y <
              currentOverlapComparedEvent.y + currentOverlapComparedEvent.h &&
            currentOverlapCheckedEvent.y + currentOverlapCheckedEvent.h >
              currentOverlapComparedEvent.y &&
            currentOverlapCheckedEvent.i !== currentOverlapComparedEvent.i;

          if (hasVerticalOverlap) {
            // There is overlap between the two events
            console.log(
              "[scheduleUtils.js] Overlap between",
              currentOverlapCheckedEventData.title,
              "and",
              currentOverlapComparedEventData.title
            );

            // Increment the overlap count for the currently checked event
            lineMatches[k].overlapCount++;
            // Add the overlapping event to the currently checked event's array of overlapping events
            lineMatches[k].overlappingEvents.push(currentOverlapComparedEvent);
          }
        }
        console.log(
          "[scheduleUtils.js]",
          lineMatches[k].overlapCount,
          "overlaps found for event",
          currentOverlapCheckedEventData.title
        );
      }

      let overlapRank = 1;

      // Loop through the line matches and adjust the layout of all events, in overlapCount order
      while (lineMatches.length > 0) {

        // Find the event with the most overlaps
        const targetEventForAdjustment = lineMatches.reduce((max, current) => {
          return current.overlapCount > max.overlapCount ? current : max;
        }, lineMatches[0]);

        let adjustedOverlapRank;

        console.log("[scheduleUtils.js] Target Overlapping Events: ", targetEventForAdjustment.overlappingEvents);

        const targetEventForAdjustmentData = events.find(
          (event) => event._id === targetEventForAdjustment.i
        );

        console.log(
          "[scheduleUtils.js] Target event for adjustment: ",
          targetEventForAdjustmentData.title
        );
        console.log("[scheduleUtils.js] Overlap rank: ", overlapRank);
        console.log(
          "[scheduleUtils.js] Overlap count: ",
          targetEventForAdjustment.overlapCount
        );

        // TODO: Check if the overlapping events are already in the final layout
        // TODO: If so, skip it and increment overlapRank by 1

        const alreadyAdjustedEvents = targetEventForAdjustment.overlappingEvents.filter(event =>
          !workingLayout.some(layoutElement => layoutElement.i === event.i)
        );

        console.log("[scheduleUtils.js] Already adjusted elements: ", alreadyAdjustedEvents);

        adjustedOverlapRank = overlapRank + alreadyAdjustedEvents.length; 

        console.log("[scheduleUtils.js] Adjusted overlap rank: ", adjustedOverlapRank);

        let updatedEventLayout = targetEventForAdjustment;

        if (targetEventForAdjustment.overlapCount > 0) {
          // Adjust the layout of the event with the most overlaps
          console.log(
            "[scheduleUtils.js] Overlaps found. Moving to adjustEventLayout"
          );
          updatedEventLayout = adjustEventLayout(
            targetEventForAdjustment,
            adjustedOverlapRank
          );
        } else {
          // No overlaps found
          console.log("[scheduleUtils.js] No overlaps found for event.");
        }

        // Add the adjusted event to the final layout
        finalLayout.push(updatedEventLayout);

        // Remove this event from the working layout
        workingLayout = workingLayout.filter(
          (event) => event.i !== targetEventForAdjustment.i
        );

        // Remove this event from the line matches
        lineMatches = lineMatches.filter(
          (event) => event.i !== targetEventForAdjustment.i
        );
      }
    }
  }

  console.log("[scheduleUtils.js] Final layout: ", finalLayout);

  return finalLayout;
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
