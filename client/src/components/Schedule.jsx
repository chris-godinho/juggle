// Schedule.jsx

const Schedule = ({ events, selectedDate }) => {
  
  const displayDate = new Date(selectedDate);
  displayDate.setHours(0, 0, 0, 0);

  const formatTime = (dateObject) => {
    const result = dateObject.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    return result;
  };

  return (
    <div className="schedule-container-jg">
      {Array.from(Array(48).keys()).map((index) => {
        const currentDisplayTime = new Date(displayDate);
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
            <div
              className={
                event && event.type === "work"
                  ? "schedule-block-title-jg work-text-jg"
                  : event && event.type === "life"
                  ? "schedule-block-title-jg life-text-jg"
                  : "schedule-block-title-jg"
              }
            >
              {event ? event.title : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Schedule;
