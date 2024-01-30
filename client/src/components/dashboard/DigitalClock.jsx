// DigitalClock.jsx

import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // TODO: To add seconds, add the following to the options: "second: '2-digit'"
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
