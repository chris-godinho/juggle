import { Link } from "react-router-dom";

import Auth from "../utils/auth";

const Schedule = () => {
  return (
    <div className="schedule-container-jg">
      {Array.from(Array(48).keys()).map((index) => {
        const hour = Math.floor(index / 2);
        const minutes = index % 2 === 0 ? "00" : "30";
        const time = `${hour}:${minutes}`;
        return (
          <div id={(index + "-block-jg")} className="schedule-block-jg">
            {time}
          </div>
        );
      })}
    </div>
  );
};

export default Schedule;
