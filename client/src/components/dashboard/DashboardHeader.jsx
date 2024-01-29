// DashboardHeader.jsx

import { useDataContext } from "../contextproviders/DataContext"
import { useModal } from "../contextproviders/ModalProvider.jsx";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

import { calculateEventStats } from "../../utils/eventUtils.js";

import NewEvent from "./NewEvent.jsx";
import UserMenu from "../usermenu/UserMenu.jsx";

export default function DashboardHeader() {

  const { events, selectedDate, setSelectedDate, username, userId, eventSubtypes, eventsRefetch } = useDataContext();

  const { openModal } = useModal();

  const handleNewEventModalClose = () => {
    eventsRefetch();
  };
  
  // Set up date variables for display
  
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { unalottedTimePercentage } = calculateEventStats(events);

  const selectPreviousDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)));
  };

  const selectNextDay = (event) => {
    setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)));
  };

  return (
    <header className="dashboard-header-jg">
      <div className="dashboard-header-button-container-jg">
        <button
          className="round-button-jg work-border-jg work-border-link-jg"
          onClick={() =>
            openModal(<UserMenu username={username} userId={userId} />)
          }
        >
          <img
            className="dashboard-profile-picture-jg"
            src="/test-prof-pic.jpg"
            alt="profile picture"
          />
        </button>
      </div>
      <div className="date-percentage-container-jg">
        <div className="selected-date-container-jg">
          <a href="#" onClick={selectPreviousDay}>
            <span className="material-symbols-outlined">
              arrow_back_ios_new
            </span>
          </a>
          <div className="selected-date-box-jg">
            <Flatpickr
              className="selected-date-box-input-jg"
              value={selectedDate}
              options={{
                dateFormat: "l, F j, Y",
                defaultDate: selectedDate,
                onChange: (date) => setSelectedDate(date[0]),
              }}
            />
          </div>
          <a href="#" onClick={selectNextDay}>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </a>
        </div>
        <div className="unalotted-percentage-jg">
          <p>Unalotted Time: {unalottedTimePercentage}%</p>
        </div>
      </div>
      <div className="dashboard-header-button-container-jg">
        <button
          className="round-button-jg life-border-jg life-border-link-jg"
          onClick={() =>
            openModal(
              <NewEvent
                eventSubtypes={eventSubtypes}
                handleNewEventModalClose={handleNewEventModalClose}
                userId={userId}
              />
            )
          }
        >
          <svg
            className="add-event-picture-jg"
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
            version="1.1"
          >
            <path d="" stroke="none" fillRule="evenodd" />
            <path
              d="M 242.184 209.500 L 242.629 243 205.314 243 L 168 243 168 255.500 L 168 268 205.500 268 L 243 268 243 301.500 L 243 335 256 335 L 269 335 269 301.500 L 269 268 306.500 268 L 344 268 344 255.500 L 344 243 306.686 243 L 269.371 243 269.816 209.500 L 270.260 176 256 176 L 241.740 176 242.184 209.500"
              stroke="none"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
