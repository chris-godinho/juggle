// Schedule.jsx

import { useModal } from "../contextproviders/ModalProvider.jsx";
import EventDetails from "../dashboard/EventDetails.jsx";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const Schedule = ({ events, selectedDate, eventSubtypes, eventsRefetch }) => {
  const { openModal } = useModal();

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

  const handleEventClick = (event) => {
    openModal(
      <EventDetails
        eventId={event._id}
        eventTitle={event.title}
        eventType={event.type}
        eventSubtype={event.subtype}
        eventDescription={event.details}
        eventStart={event.eventStart}
        eventEnd={event.eventEnd}
        eventLocation={event.location}
        eventLinks={event.links}
        eventFiles={event.files}
        eventPriority={event.priority}
        eventSetReminder={event.setReminder}
        eventReminderTime={event.reminderTime}
        eventCompleted={event.completed}
        eventSubtypes={eventSubtypes}
        eventsRefetch={eventsRefetch}
      />
    );
  };

  const handleEventChange = (layout) => {
    // TODO: When an event overlaps with another, resize the other event accordingly
    // (if there less than five on that same time block)
  };

  // TODO: Prevent grid height from exceeding 48 rows (30 minutes per row)

  // TODO: Add dashed grid underneath react grid layout

  /* <ScheduleGrid /> */

  return (
    <div className="schedule-container-jg grid-container-background-jg">
      <ResponsiveGridLayout
        className="layout"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 5, sm: 5, xs: 5, xxs: 5 }}
        compactType={null}
        draggableCancel=".widget-prevent-drag-wf"
        autoSize={false}
        rowHeight={30}
        containerPadding={[5, 5]}
        margin={[5, 10]}
        resizeHandles={["n", "s"]}
        onDragStop={handleEventChange}
        onResizeStop={handleEventChange}
      >
        {events.map((event) => (
          <div
            key={event._id}
            className={
              event.type === "work"
                ? "schedule-event-box-jg schedule-event-box-work-jg"
                : "schedule-event-box-jg schedule-event-box-life-jg"
            }
            data-grid={{ w: 5, h: 1, x: 0, y: 0 }}
          >
            <p
              className="schedule-event-name-jg widget-prevent-drag-wf"
              onClick={() => handleEventClick(event)}
            >
              {formatTime(new Date(event.eventStart))} - {event.title}
            </p>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Schedule;
