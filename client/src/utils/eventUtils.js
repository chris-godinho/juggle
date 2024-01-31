// eventUtils.js

export const calculateSleepingHours = (userSettings) => {
  console.log("[eventUtils.js] userSettings: ", userSettings);
  const sleepingHoursMatrix = userSettings?.sleepingHours && {};
  let sleepingHours = 0;

  // Iterate through the days of the week
  Object.keys(sleepingHoursMatrix).forEach((day) => {
    const { start, end } = sleepingHoursMatrix[day];

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

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60 * 60);

    // Add the hours to the total
    sleepingHours += hoursDifference;
  });

  console.log("[eventUtils.js] sleepingHours: ", sleepingHours);

  return sleepingHours;
};

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

  // const sleepingHours = calculateSleepingHours(userSettings);
  const sleepingHours = 8 * 60;
  const totalAlottedTimeWithSleepingHours = 24 * 60;
  const totalAlottedTime = totalAlottedTimeWithSleepingHours - sleepingHours;
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
  ignoreUnalotted,
  percentageBasis,
  settingsBalanceGoal,
  dashboardLayout,
  workPercentage,
  lifePercentage,
  workPercentageWithSleepingHours,
  lifePercentageWithSleepingHours,
  workPercentageIgnoreUnalotted,
  lifePercentageIgnoreUnalotted,
  workPreferredActivities,
  lifePreferredActivities,
  workGoalActivities,
  lifeGoalActivities
) => {
  console.log("eventType: ", eventType);
  console.log("ignoreUnalotted: ", ignoreUnalotted);
  console.log("percentageBasis: ", percentageBasis);
  console.log("settingsBalanceGoal: ", settingsBalanceGoal);
  console.log("dashboardLayout: ", dashboardLayout);
  console.log("workPercentage: ", workPercentage);
  console.log("lifePercentage: ", lifePercentage);
  console.log(
    "workPercentageWithSleepingHours: ",
    workPercentageWithSleepingHours
  );
  console.log(
    "lifePercentageWithSleepingHours: ",
    lifePercentageWithSleepingHours
  );
  console.log("workPercentageIgnoreUnalotted: ", workPercentageIgnoreUnalotted);
  console.log("lifePercentageIgnoreUnalotted: ", lifePercentageIgnoreUnalotted);
  console.log("workPreferredActivities: ", workPreferredActivities);
  console.log("lifePreferredActivities: ", lifePreferredActivities);
  console.log("workGoalActivities: ", workGoalActivities);
  console.log("lifeGoalActivities: ", lifeGoalActivities);

  let targetPercentage;
  let otherPercentage;
  let activityPool = [];
  let recommendationSource = [];
  let recommendationPool = [];
  let targetBalanceGoal;
  let recommendationCount = 0;
  let recommendationList = [];
  let dividingFactor;

  if (eventType === "Work") {
    targetBalanceGoal = settingsBalanceGoal;
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
    targetBalanceGoal = 100 - settingsBalanceGoal;
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

  const preferredActivities = Array.from(
    Object.entries(activityPool)
      .filter(([key, value]) => value === true)
      .map(([key]) => key)
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

  if (
    (dashboardLayout === "one-sidebar-left" ||
      dashboardLayout === "one-sidebar-right") &&
    recommendationCount > 2
  ) {
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
