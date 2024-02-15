// LifeActivitiesCheckboxes.jsx
// List of checkboxes for preferred life activities for Settings and Welcome pages

import { useDataContext } from "../contextproviders/DataContext";

import { lifeGoalActivities } from "../../utils/preferredActivities.js";

export default function LifeActivitiesCheckboxes({ boxSize = "normal" }) {
  const { formData, setFormData } = useDataContext();

  // Convert string to camelCase
  function toCamelCase(inputString) {
    const camelCaseResult = inputString.replace(/\s(.)/g, (_, c) => c.toUpperCase());
    return camelCaseResult.charAt(0).toLowerCase() + camelCaseResult.slice(1);
  }

  // Toggle checkbox state and update form data
  const handleCheckboxChange = (event) => {
    const currentState = formData?.user.lifePreferredActivities?.[event.target.name];

    setFormData({
      ...formData,
      user: {
        ...formData.user,
        lifePreferredActivities: {
          ...formData?.user?.lifePreferredActivities,
          [event.target.name]: !currentState,
        },
      },
    });
  };

  return (
    <div className="work-life-activities-list-jg">
      {lifeGoalActivities.map((activity, index) => (
        <label
          key={index}
          className={`work-life-activity-checkbox-jg checkbox-jg ${boxSize === "small" ? "work-life-activities-small-jg" : ""}`}
          title={activity.description}
        >
          <input
            type="checkbox"
            name={toCamelCase(activity.title)}
            checked={
              formData?.user?.lifePreferredActivities?.[
                toCamelCase(activity.title)
              ] ?? false
            }
            onChange={handleCheckboxChange}
          />
          {activity.title}
        </label>
      ))}
    </div>
  );
}
