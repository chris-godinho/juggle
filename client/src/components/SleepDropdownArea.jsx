import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";

export default function SleepDropdownArea() {
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

    return (
        <div className="sleep-dropdown-area-jg">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="sleep-dropdown-day-jg">
            <p className="sleep-dropdown-day-title-jg">{day}</p>
            <Flatpickr
              name={`day-${index + 1}-sleep-start`}
              value={"11:00 PM"}
              className="sleep-select-jg"
              options={{
                noCalendar: true,
                enableTime: true,
                allowInput: true,
                dateFormat: "h:i K",
                closeOnSelect: true,
                clickOpens: true,
              }}
              onChange={(selectedDates, dateString, instance) => {
                console.log(
                  `[SleepDropdownArea.jsx] day${index + 1}SleepStart onChange:`,
                  selectedDates,
                  dateString,
                  instance
                );
                handleInputChange({
                  target: {
                    name: `day${index + 1}SleepStart`,
                    value: dateString,
                  },
                });
              }}
            />
            <p className="sleep-dropdown-day-to-jg">to</p>
            <Flatpickr
              name={`day-${index + 1}-sleep-end`}
              value={"7:00 AM"}
              className="sleep-select-jg"
              options={{
                noCalendar: true,
                enableTime: true,
                allowInput: true,
                dateFormat: "h:i K",
                closeOnSelect: true,
                clickOpens: true,
              }}
              onChange={(selectedDates, dateString, instance) => {
                console.log(
                  `[Dashboard.jsx] day${index + 1}SleepEnd onChange:`,
                  selectedDates,
                  dateString,
                  instance
                );
                handleInputChange({
                  target: {
                    name: `day${index + 1}SleepEnd`,
                    value: dateString,
                  },
                });
              }}
            />
          </div>
        ))}
      </div>
    )

};