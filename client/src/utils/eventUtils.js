// eventUtils.js

export const calculateEventStats = (events) => {
  // TODO: Consider when events overlap in time

  // Initialize counters
  let workCount = 0;
  let workTotalTime = 0;
  let lifeCount = 0;
  let lifeTotalTime = 0;
  const eventCount = events.length;

  // Iterate through events
  events.forEach((event) => {
    const { type, eventStart, eventEnd } = event;

    // Calculate duration in milliseconds
    const duration = new Date(eventEnd).getTime() - new Date(eventStart).getTime();

    // Update counters based on event type
    if (type === "work") {
      workCount++;
      workTotalTime += duration;
    } else if (type === "life") {
      lifeCount++;
      lifeTotalTime += duration;
    }
  });

  // Convert total time from milliseconds to minutes
  workTotalTime /= 1000 * 60;
  lifeTotalTime /= 1000 * 60;

  const sleepingHours = 8 * 60;
  const totalAlottedTime = 24 * 60 - sleepingHours;

  let workPercentage;
  workTotalTime > 0
    ? (workPercentage = Math.round((workTotalTime / totalAlottedTime) * 100))
    : (workPercentage = 0);

  let lifePercentage;
  lifeTotalTime > 0
    ? (lifePercentage = Math.round((lifeTotalTime / totalAlottedTime) * 100))
    : (lifePercentage = 0);

  const unalottedTimePercentage = 100 - workPercentage - lifePercentage;

  // TODO: Refine the stats to adapt to several options in Settings (unused variables: sleepingHours, totalAllottedTime, unalottedTimePercentage)

  return {
    eventCount,
    totalAlottedTime,
    workCount,
    workTotalTime,
    workPercentage,
    lifeCount,
    lifeTotalTime,
    lifePercentage,
    unalottedTimePercentage
  };
};

export const calculateSingleEventPercentage = (event, totalAlottedTime) => {
  let eventPercentage;

  const eventDuration =
    (new Date(event.eventEnd) - new Date(event.eventStart)) / (1000 * 60);

  eventPercentage = (eventDuration / totalAlottedTime) * 100;
  
  return eventPercentage;
};