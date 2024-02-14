// SleepDropDownArea.jsx

import { useDataContext } from "../contextproviders/DataContext";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

export default function SleepDropdownArea() {
  const { formData, setFormData } = useDataContext();

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const [dayName, dayProperty] = name.split("-");

    setFormData({
      ...formData,
      user: {
        ...formData.user,
        sleepingHours: {
          ...formData?.user?.sleepingHours,
          [dayName]: {
            ...formData?.user?.sleepingHours?.[dayName],
            [dayProperty]: value,
          },
        },
      },
    });
  };

  return (
    <div className="sleep-dropdown-area-jg">
      {daysOfWeek.map((day, index) => (
        <div key={index} className="sleep-dropdown-day-jg">
          <p className="sleep-dropdown-day-title-jg">{day}</p>
          <div className="sleep-datepicker-container-jg">
            <Flatpickr
              name={day.toLowerCase()}
              value={
                formData?.user?.sleepingHours?.[day.toLowerCase()]?.start ||
                "11:00 PM"
              }
              className="sleep-select-jg"
              options={{
                noCalendar: true,
                enableTime: true,
                allowInput: true,
                dateFormat: "h:i K",
                closeOnSelect: true,
                clickOpens: true,
                minuteIncrement: 30,
              }}
              onChange={(selectedDates, dateString, instance) => {
                console.log(
                  `[SleepDropdownArea.jsx] ${day} Sleep Start onChange:`,
                  selectedDates,
                  dateString,
                  instance
                );
                handleInputChange({
                  target: {
                    name: `${day.toLowerCase()}-start`,
                    value: dateString,
                  },
                });
              }}
            />
            <p className="sleep-dropdown-day-to-jg">to</p>
            <Flatpickr
              name={day.toLowerCase()}
              value={
                formData?.user?.sleepingHours?.[day.toLowerCase()]?.end ||
                "7:00 AM"
              }
              className="sleep-select-jg"
              options={{
                noCalendar: true,
                enableTime: true,
                allowInput: true,
                dateFormat: "h:i K",
                closeOnSelect: true,
                clickOpens: true,
                minuteIncrement: 30,
              }}
              onChange={(selectedDates, dateString, instance) => {
                console.log(
                  `[SleepDropdownArea.jsx] ${day} Sleep End onChange:`,
                  selectedDates,
                  dateString,
                  instance
                );
                handleInputChange({
                  target: {
                    name: `${day.toLowerCase()}-end`,
                    value: dateString,
                  },
                });
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
