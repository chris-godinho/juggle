// eventUtils.js

export const calculateEventStats = (events) => {
  // TODO: Consider when events overlap in time

  // Initialize counters
  let workCount = 0;
  let workTotalTime = 0;
  let lifeCount = 0;
  let lifeTotalTime = 0;

  // Iterate through events
  events.forEach((event) => {
    const { type, eventStart, eventEnd } = event;

    // Calculate duration in milliseconds
    const startTime = new Date(eventStart).getTime();
    const endTime = new Date(eventEnd).getTime();
    const duration = endTime - startTime;

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

  console.log("[eventUtils.js] Work Count:", workCount);
  console.log("[eventUtils.js] Total Work Time (minutes):", workTotalTime);
  console.log("[eventUtils.js] Life Count:", lifeCount);
  console.log("[eventUtils.js] Total Life Time (minutes):", lifeTotalTime);

  return {
    workCount,
    workTotalTime,
    lifeCount,
    lifeTotalTime,
  };
};
