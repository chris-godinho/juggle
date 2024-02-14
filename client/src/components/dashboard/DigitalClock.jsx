// DigitalClock.jsx
// Display a simple digital clock in the dashboard side panel (in non-stats setting)

import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  // Set up state for current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Format current time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "numeric", // Display hours without leading zero
    minute: "2-digit", // Display minutes with leading zero
    hour12: true, // Display in 12-hour format
  });

  const hour = formattedTime.split(":")[0];
  const minuteAmPm = formattedTime.split(":")[1];

  return (
    <div className="digital-clock-jg">
      <span>{hour}</span>
      <span className="colon-jg">:</span>
      <span>{minuteAmPm}</span>
    </div>
  );
};

export default DigitalClock;
