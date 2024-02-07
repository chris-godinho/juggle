// eventUtils.js

import { removeTypename } from "./helpers";

export const calculateSleepingHours = (fetchedSettings, selectedDate) => {
  const weekdayList = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  console.log("[eventUtils.js] fetchedSettings: ", fetchedSettings);
  console.log(
    "[eventUtils.js] fetchedSettings?.sleepingHours: ",
    fetchedSettings?.sleepingHours
  );
  const sleepingHoursMatrix = fetchedSettings?.sleepingHours || {};
  console.log("[eventUtils.js] sleepingHoursMatrix: ", sleepingHoursMatrix);
  const filteredSleepingHoursMatrix = removeTypename(sleepingHoursMatrix);
  console.log(
    "[eventUtils.js] filteredSleepingHoursMatrix: ",
    filteredSleepingHoursMatrix
  );
  let sleepingHoursInMinutes = 0;
  const targetDay = weekdayList[selectedDate.getDay()];

  if (filteredSleepingHoursMatrix[targetDay]) {
    const { start, end } = filteredSleepingHoursMatrix[targetDay];
    console.log("[eventUtils.js] start: ", start);
    console.log("[eventUtils.js] end: ", end);

    // Convert start and end times to Date objects
    const startTime = new Date(`January 1, 2022 ${start}`);
    const endTime = new Date(`January 1, 2022 ${end}`);
    console.log("[eventUtils.js] startTime: ", startTime);
    console.log("[eventUtils.js] endTime: ", endTime);

    // Check if end time is earlier than start time (next day)
    if (endTime < startTime) {
      console.log(
        "[eventUtils.js] endTime < startTime, adjusting end time to next day..."
      );
      // Adjust the end time to be on the next day
      endTime.setDate(endTime.getDate() + 1);
      console.log("[eventUtils.js] new endTime: ", endTime);
    }

    // Calculate the time difference in milliseconds
    const timeDifference = endTime - startTime;
    console.log("[eventUtils.js] timeDifference: ", timeDifference);

    // Convert milliseconds to minutes
    sleepingHoursInMinutes = timeDifference / (1000 * 60);
  }

  console.log(
    "[eventUtils.js] sleepingHoursInMinutes: ",
    sleepingHoursInMinutes
  );

  return sleepingHoursInMinutes;
};

export const calculateEventStats = (events, fetchedSettings, selectedDate) => {
  console.log("[eventUtils.js] selectedDate: ", selectedDate);

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
    const duration =
      new Date(eventEnd).getTime() - new Date(eventStart).getTime();

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

  const sleepingHoursInMinutes = calculateSleepingHours(
    fetchedSettings,
    selectedDate
  );
  // const sleepingHours = 8 * 60;
  const totalAlottedTimeWithSleepingHours = 24 * 60;
  const totalAlottedTime =
    totalAlottedTimeWithSleepingHours - sleepingHoursInMinutes;
  const totalAlottedTimeIgnoreUnalotted = workTotalTime + lifeTotalTime;

  let workPercentage = 0;
  let workPercentageWithSleepingHours = 0;
  let workPercentageIgnoreUnalotted = 0;
  if (workTotalTime > 0) {
    workPercentage = Math.round((workTotalTime / totalAlottedTime) * 100);
    workPercentageWithSleepingHours = Math.round(
      (workTotalTime / totalAlottedTimeWithSleepingHours) * 100
    );
    workPercentageIgnoreUnalotted = Math.round(
      (workTotalTime / totalAlottedTimeIgnoreUnalotted) * 100
    );
  }

  let lifePercentage = 0;
  let lifePercentageWithSleepingHours = 0;
  let lifePercentageIgnoreUnalotted = 0;
  if (lifeTotalTime > 0) {
    lifePercentage = Math.round((lifeTotalTime / totalAlottedTime) * 100);
    lifePercentageWithSleepingHours = Math.round(
      (lifeTotalTime / totalAlottedTimeWithSleepingHours) * 100
    );
    lifePercentageIgnoreUnalotted = Math.round(
      (lifeTotalTime / totalAlottedTimeIgnoreUnalotted) * 100
    );
  }

  const unalottedTimePercentage = 100 - workPercentage - lifePercentage;
  const unalottedTimePercentageWithSleepingHours =
    100 - workPercentageWithSleepingHours - lifePercentageWithSleepingHours;

  return {
    eventCount,
    totalAlottedTime,
    totalAlottedTimeWithSleepingHours,
    totalAlottedTimeIgnoreUnalotted,
    unalottedTimePercentage,
    unalottedTimePercentageWithSleepingHours,
    workCount,
    workTotalTime,
    workPercentage,
    workPercentageWithSleepingHours,
    workPercentageIgnoreUnalotted,
    lifeCount,
    lifeTotalTime,
    lifePercentage,
    lifePercentageWithSleepingHours,
    lifePercentageIgnoreUnalotted,
  };
};

export const calculateSingleEventPercentage = (
  event,
  totalAlottedTime,
  totalAlottedTimeWithSleepingHours,
  totalAlottedTimeIgnoreUnalotted,
  percentageBasis,
  ignoreUnalotted
) => {
  let eventPercentage;

  const eventDuration =
    (new Date(event.eventEnd) - new Date(event.eventStart)) / (1000 * 60);

  let totalTime;
  if (ignoreUnalotted) {
    totalTime = totalAlottedTimeIgnoreUnalotted;
  } else if (percentageBasis === "waking") {
    totalTime = totalAlottedTime;
  } else {
    totalTime = totalAlottedTimeWithSleepingHours;
  }

  eventPercentage = (eventDuration / totalTime) * 100;

  return eventPercentage;
};

export const findDisplayPercentage = (
  eventType,
  ignoreUnalotted,
  percentageBasis,
  workPercentage,
  workPercentageIgnoreUnalotted,
  workPercentageWithSleepingHours,
  lifePercentage,
  lifePercentageIgnoreUnalotted,
  lifePercentageWithSleepingHours
) => {
  let displayPercentage;
  if (eventType === "Work") {
    if (ignoreUnalotted) {
      displayPercentage = workPercentageIgnoreUnalotted;
    } else {
      if (percentageBasis === "waking") {
        displayPercentage = workPercentage;
      } else {
        displayPercentage = workPercentageWithSleepingHours;
      }
    }
  } else {
    if (ignoreUnalotted) {
      displayPercentage = lifePercentageIgnoreUnalotted;
    } else {
      if (percentageBasis === "waking") {
        displayPercentage = lifePercentage;
      } else {
        displayPercentage = lifePercentageWithSleepingHours;
      }
    }
  }

  return displayPercentage;
};

export const findDisplayText = (ignoreUnalotted, percentageBasis) => {
  let displayText;
  if (ignoreUnalotted) {
    displayText = "of your allocated time";
  } else {
    displayText =
      percentageBasis === "waking" ? "of your waking hours" : "of your day";
  }

  return displayText;
};

export const findRecommendations = (
  eventType,
  isOneBarLayout,
  workGoalActivities,
  lifeGoalActivities,
  ignoreUnalotted,
  percentageBasis,
  balanceGoal,
  workPreferredActivities,
  lifePreferredActivities,
  workPercentage,
  lifePercentage,
  workPercentageWithSleepingHours,
  lifePercentageWithSleepingHours,
  workPercentageIgnoreUnalotted,
  lifePercentageIgnoreUnalotted
) => {
  let targetPercentage;
  let otherPercentage;
  let activityPool = {};
  let recommendationSource = [];
  let recommendationPool = [];
  let targetBalanceGoal;
  let recommendationCount = 0;
  let recommendationList = [];
  let dividingFactor;

  if (eventType === "Work") {
    targetBalanceGoal = balanceGoal;
    if (ignoreUnalotted) {
      targetPercentage = workPercentageIgnoreUnalotted;
      otherPercentage = lifePercentageIgnoreUnalotted;
    } else if (percentageBasis === "waking") {
      targetPercentage = workPercentage;
      otherPercentage = lifePercentage;
    } else {
      targetPercentage = workPercentageWithSleepingHours;
      otherPercentage = lifePercentageWithSleepingHours;
    }
    activityPool = workPreferredActivities;
    recommendationSource = workGoalActivities;
  } else {
    targetBalanceGoal = 100 - balanceGoal;
    if (ignoreUnalotted) {
      targetPercentage = lifePercentageIgnoreUnalotted;
      otherPercentage = workPercentageIgnoreUnalotted;
    } else if (percentageBasis === "waking") {
      targetPercentage = lifePercentage;
      otherPercentage = workPercentage;
    } else {
      targetPercentage = lifePercentageWithSleepingHours;
      otherPercentage = workPercentageWithSleepingHours;
    }
    activityPool = lifePreferredActivities;
    recommendationSource = lifeGoalActivities;
  }

  const preferredActivities = Object.keys(activityPool).filter(
    (key) => activityPool[key] === true
  );

  if (ignoreUnalotted) {
    dividingFactor = 50;
  } else if (percentageBasis === "waking") {
    dividingFactor = 15;
  } else {
    dividingFactor = 22.5;
  }

  if (targetPercentage < otherPercentage) {
    recommendationCount += 2;
    recommendationCount += Math.floor(
      (otherPercentage - targetPercentage) / dividingFactor
    );
  }

  if (targetPercentage < targetBalanceGoal) {
    recommendationCount += 1;
  } else {
    recommendationCount = 0;
  }

  if (isOneBarLayout && recommendationCount > 2) {
    recommendationCount = 2;
  }

  for (let i = 0; i < recommendationCount; i++) {
    for (const selectedActivity of preferredActivities) {
      const matchingObject = recommendationSource.find(
        (activity) => activity.key === selectedActivity
      );

      if (matchingObject) {
        const suggestions = matchingObject.suggestions;

        // Add all elements from the "suggestions" field to recommendationPool
        recommendationPool.push(...suggestions);
      }
    }

    // Randomly select an element from recommendationPool
    const selectedRecommendation =
      recommendationPool[Math.floor(Math.random() * recommendationPool.length)];

    // Add it to recommendationList
    recommendationList.push(selectedRecommendation);

    // Remove the selected element from recommendationPool
    const indexToRemove = recommendationPool.indexOf(selectedRecommendation);
    if (indexToRemove !== -1) {
      recommendationPool.splice(indexToRemove, 1);
    }

    // If there are no recommendations left, stop the loop
    if (recommendationPool.length === 0) {
      break;
    }
  }

  return recommendationList;
};

const findEventPools = (events) => {
  // Get the current date
const currentDate = new Date();

// Get the first day of the current month
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Get the first day of the previous month
const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
const currentDayOfWeek = currentDate.getDay();

// Calculate the difference between the current day and the last Sunday
const daysSinceSunday = currentDayOfWeek === 0 ? 0 : currentDayOfWeek;

// Get the first day of the current week (Sunday)
const firstDayOfCurrentWeek = new Date(currentDate);
firstDayOfCurrentWeek.setDate(currentDate.getDate() - daysSinceSunday);

// Get the first day of the previous week
const firstDayOfPreviousWeek = new Date(firstDayOfCurrentWeek);
firstDayOfPreviousWeek.setDate(firstDayOfCurrentWeek.getDate() - 7);

// Filter events based on start dates
const eventsInCurrentMonth = events.filter(event => new Date(event.eventStart) >= firstDayOfMonth && new Date(event.eventStart) < currentDate);

const eventsInPreviousMonth = events.filter(event => new Date(event.eventStart) >= firstDayOfPreviousMonth && new Date(event.eventStart) < firstDayOfMonth);

const eventsInCurrentWeek = events.filter(event => new Date(event.eventStart) >= firstDayOfCurrentWeek && new Date(event.eventStart) < currentDate);

const eventsInPreviousWeek = events.filter(event => new Date(event.eventStart) >= firstDayOfPreviousWeek && new Date(event.eventStart) < firstDayOfCurrentWeek);

console.log("[eventUtils.js] eventsInCurrentMonth: ", eventsInCurrentMonth);
console.log("[eventUtils.js] eventsInPreviousMonth: ", eventsInPreviousMonth);
console.log("[eventUtils.js] eventsInCurrentWeek: ", eventsInCurrentWeek);
console.log("[eventUtils.js] eventsInPreviousWeek: ", eventsInPreviousWeek);

return {
  eventsInCurrentMonth,
  eventsInPreviousMonth,
  eventsInCurrentWeek,
  eventsInPreviousWeek
};
};

const calculateEventPoolsStats = (events) => {

  // TODO: Find total number of events for the user, then the total number of work and life events

  // TODO: Find total time of events for the user, then the total time spent on work and life events

  // TODO: Calculate the percentage of work and life events

  // TODO: Calculate the percentage of time spent on work and life events

  // TODO: Find the total number of days with events

  // TODO: Find the average number of events per day (also for work and life events)

  // TODO: Find the average time spent on events per day (also for work and life events)

};

export const calculateMacroStats = (events) => {
  console.log("[eventUtils.js] events: ", events);

  const eventPools = findEventPools(events);

  return true;
};
