// Schedule.jsx

import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_EVENTS_BY_DATE } from "../utils/queries";

import LoadingSpinner from "./LoadingSpinner";

const Schedule = ({ userId, selectedDate, timeZoneOffset, shouldRefetch }) => {
  useEffect(() => {
    refetch();
  }, [shouldRefetch]);

  console.log("[Schedule.jsx] userId:", userId, "selectedDate:", selectedDate);

  const displayTime = new Date(selectedDate);
  displayTime.setHours(0, 0, 0, 0);

  const { loading, data, error, refetch } = useQuery(QUERY_EVENTS_BY_DATE, {
    variables: { user: userId, eventStart: displayTime },
  });

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.error("[Schedule.jsx] GraphQL Error:", error);
    return <div>Error fetching data.</div>;
  }

  const events = data?.eventsByDate || [];

  const formatTime = (dateObject) => {
    // console.log("[Schedule.jsx] formatTime dateObject:", dateObject);
    const result = dateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    // console.log("[Schedule.jsx] formatTime result:", result);
    return result;
  };

  return (
    <div className="schedule-container-jg">
      {Array.from(Array(48).keys()).map((index) => {
        const currentDisplayTime = new Date(displayTime);
        currentDisplayTime.setMinutes(
          currentDisplayTime.getMinutes() + index * 30
        );

        const event = events.find(
          (e) =>
            new Date(e.eventStart) <= currentDisplayTime &&
            currentDisplayTime < new Date(e.eventEnd)
        );

        return (
          <div
            key={index}
            id={index + "-block-jg"}
            className="schedule-block-jg"
          >
            <div className="schedule-block-time-jg">
              {formatTime(currentDisplayTime)}
            </div>
            <div className="schedule-block-title-jg">
              {event ? event.title : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Schedule;
