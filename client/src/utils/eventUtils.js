// eventUtils.js

import { removeTypename, weekdayList } from "./helpers";

export const calculateSleepingHours = (fetchedSettings, selectedDate) => {
  const sleepingHoursMatrix = fetchedSettings?.sleepingHours || {};
  const filteredSleepingHoursMatrix = removeTypename(sleepingHoursMatrix);
  let sleepingHoursInMinutes = 0;
  const targetDay = weekdayList[selectedDate.getDay()];

  if (filteredSleepingHoursMatrix[targetDay]) {
    const { start, end } = filteredSleepingHoursMatrix[targetDay];

    // Convert start and end times to Date objects
    const startTime = new Date(`January 1, 2022 ${start}`);
    const endTime = new Date(`January 1, 2022 ${end}`);

    // Check if end time is earlier than start time (next day)
    if (endTime < startTime) {
      // Adjust the end time to be on the next day
      endTime.setDate(endTime.getDate() + 1);
    }

    // Calculate the time difference in milliseconds
    const timeDifference = endTime - startTime;

    // Convert milliseconds to minutes
    sleepingHoursInMinutes = timeDifference / (1000 * 60);
  }

  return sleepingHoursInMinutes;
};

export const calculateEventStats = (events, fetchedSettings, selectedDate) => {
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
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Get the first day of the previous month
  const firstDayOfPreviousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );

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
  const eventsInCurrentMonth = events.filter(
    (event) =>
      new Date(event.eventStart) >= firstDayOfMonth &&
      new Date(event.eventStart) < currentDate
  );

  const eventsInPreviousMonth = events.filter(
    (event) =>
      new Date(event.eventStart) >= firstDayOfPreviousMonth &&
      new Date(event.eventStart) < firstDayOfMonth
  );

  const eventsInCurrentWeek = events.filter(
    (event) =>
      new Date(event.eventStart) >= firstDayOfCurrentWeek &&
      new Date(event.eventStart) < currentDate
  );

  const eventsInPreviousWeek = events.filter(
    (event) =>
      new Date(event.eventStart) >= firstDayOfPreviousWeek &&
      new Date(event.eventStart) < firstDayOfCurrentWeek
  );

  return {
    eventsInCurrentMonth,
    eventsInPreviousMonth,
    eventsInCurrentWeek,
    eventsInPreviousWeek,
  };
};

const calculateTotalEventTime = (events) => {
  let totalEventTime = 0;

  events.forEach((event) => {
    const { eventStart, eventEnd } = event;

    // Calculate duration in milliseconds
    const duration =
      new Date(eventEnd).getTime() - new Date(eventStart).getTime();

    // Add duration to total event time
    totalEventTime += duration;
  });

  // Convert total time from milliseconds to minutes
  totalEventTime /= 1000 * 60;

  return totalEventTime;
};

export const formatMinutesAsHoursAndMinutes = (totalMinutes) => {
  const roundedTotalMinutes = Math.round(totalMinutes);

  const hours = Math.floor(roundedTotalMinutes / 60);
  const minutes = roundedTotalMinutes % 60;

  const formattedHours = hours > 0 ? `${hours}h` : "";
  const formattedMinutes =
    minutes > 0 ? `${minutes.toString().padStart(2, "0")}min` : "";

  return `${formattedHours}${formattedMinutes}`;
};

const calculateEventPoolsStats = (events) => {
  const totalEventCount = events.length;

  const workEvents = events.filter((event) => event.type === "work");
  const lifeEvents = events.filter((event) => event.type === "life");

  const workEventCount = workEvents.length;
  const lifeEventCount = lifeEvents.length;

  const workEventPercentage = Math.round(
    (workEventCount / totalEventCount) * 100
  );
  const lifeEventPercentage = Math.round(
    (lifeEventCount / totalEventCount) * 100
  );

  const totalEventTime = calculateTotalEventTime(events);
  const workEventTime = calculateTotalEventTime(workEvents);
  const lifeEventTime = calculateTotalEventTime(lifeEvents);

  const formattedTotalEventTime =
    formatMinutesAsHoursAndMinutes(totalEventTime);
  const formattedWorkEventTime = formatMinutesAsHoursAndMinutes(workEventTime);
  const formattedLifeEventTime = formatMinutesAsHoursAndMinutes(lifeEventTime);

  const workEventTimePercentage = Math.round(
    (workEventTime / totalEventTime) * 100
  );

  const lifeEventTimePercentage = Math.round(
    (lifeEventTime / totalEventTime) * 100
  );

  const uniqueDates = [
    ...new Set(events.map((event) => event.eventStart.split("T")[0])),
  ];
  const totalDaysWithEvents = uniqueDates.length;

  const averageEventsPerDay = (totalEventCount / totalDaysWithEvents).toFixed(
    1
  );
  const averageWorkEventsPerDay = (
    workEventCount / totalDaysWithEvents
  ).toFixed(1);
  const averageLifeEventsPerDay = (
    lifeEventCount / totalDaysWithEvents
  ).toFixed(1);

  // Assuming calculateTotalEventTime returns time in minutes
  const formattedAverageTimePerDay = formatMinutesAsHoursAndMinutes(
    totalEventTime / totalDaysWithEvents
  );
  const formattedAverageWorkTimePerDay = formatMinutesAsHoursAndMinutes(
    workEventTime / totalDaysWithEvents
  );
  const formattedAverageLifeTimePerDay = formatMinutesAsHoursAndMinutes(
    lifeEventTime / totalDaysWithEvents
  );

  return {
    totalEventCount,
    workEventCount,
    lifeEventCount,
    workEventPercentage,
    lifeEventPercentage,
    totalEventTime,
    workEventTime,
    lifeEventTime,
    formattedTotalEventTime,
    formattedWorkEventTime,
    formattedLifeEventTime,
    workEventTimePercentage,
    lifeEventTimePercentage,
    averageEventsPerDay,
    averageWorkEventsPerDay,
    averageLifeEventsPerDay,
    formattedAverageTimePerDay,
    formattedAverageWorkTimePerDay,
    formattedAverageLifeTimePerDay,
  };
};

export const calculateMacroStats = (events) => {
  const eventPools = findEventPools(events);

  const allTimeMacroStats = calculateEventPoolsStats(events);
  const currentMonthMacroStats = calculateEventPoolsStats(
    eventPools.eventsInCurrentMonth
  );
  const previousMonthMacroStats = calculateEventPoolsStats(
    eventPools.eventsInPreviousMonth
  );
  const currentWeekMacroStats = calculateEventPoolsStats(
    eventPools.eventsInCurrentWeek
  );
  const previousWeekMacroStats = calculateEventPoolsStats(
    eventPools.eventsInPreviousWeek
  );

  return {
    allTimeMacroStats,
    currentMonthMacroStats,
    previousMonthMacroStats,
    currentWeekMacroStats,
    previousWeekMacroStats,
  };
};

export const validateEventForm = (formData, showStats) => {
  console.log("[eventUtils.jsx] in validateEventForm()");

  let errorMessage = "";
  let finalFormData;

  if (formData.completed === "") {
    formData.completed = false;
  }

  if (formData.title === "" && !errorMessage) {
    errorMessage = "Please enter a title for the event.";
  }

  console.log("[eventUtils.jsx] formData.type:", formData.type);

  if (formData.type === "" && showStats && !errorMessage) {
    errorMessage = "Please select a type for the event.";
  }

  if (formData.type === "" && !showStats) {
    formData.type = "unspecified";
  }

  if (
    (formData.startDate === "" || formData.startTime === "") &&
    (formData.endDate !== "" || formData.endTime !== "") &&
    !errorMessage
  ) {
    errorMessage =
      "Event start date and time must be set when setting an end date/time.";
  }

  if (
    (formData.startDate !== "" || formData.startTime !== "") &&
    ((formData.endDate === "" && formData.endTime !== "") ||
      (formData.endDate !== "" && formData.endTime === "")) &&
    !errorMessage
  ) {
    errorMessage = "Please enter both an end date and time.";
  }

  // Combine startDate and startTime into eventStart
  const eventStartDate = formData.startDate || new Date().toLocaleDateString();
  const eventStartTime = formData.startTime || "00:00";
  const eventStart = new Date(`${eventStartDate} ${eventStartTime}`);

  // Combine endDate and endTime into eventEnd
  const eventEndDate = formData.endDate;
  const eventEndTime = formData.endTime || "00:00";
  const eventEnd = new Date(`${eventEndDate} ${eventEndTime}`);

  console.log("[eventUtils.jsx] eventStart:", eventStart);
  console.log("[eventUtils.jsx] eventEnd:", eventEnd);

  if (eventEnd < eventStart && !errorMessage) {
    errorMessage = "Event end date must be later than the start date.";
  }

  // Combine reminderDate and reminderTime into eventReminderTime
  const eventReminderTime = formData.reminderTime || "00:00";
  let eventReminderDate;
  if (formData.reminderDate === "" && formData.reminderTime !== "") {
    eventReminderDate = eventStartDate;
  } else {
    eventReminderDate = formData.reminderDate;
  }
  const reminderTime = new Date(`${eventReminderDate} ${eventReminderTime}`);

  if (reminderTime > eventStart && !errorMessage) {
    errorMessage =
      "Reminder must be set for a time before the start of the event.";
  }

  // Create the final form data
  finalFormData = {
    ...formData,
    eventStart,
    eventEnd,
    reminderTime,
  };

  return {
    finalFormData,
    errorMessage,
  };
};
