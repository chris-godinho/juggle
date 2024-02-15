// WorkActivitiesCheckboxes.jsx
// List of checkboxes for preferred work activities for Settings and Welcome pages

import { useDataContext } from "../contextproviders/DataContext";

import { workGoalActivities } from "../../utils/preferredActivities.js";

export default function WorkActivitiesCheckboxes({ boxSize = "normal" }) {
  const { formData, setFormData } = useDataContext();

  // Convert string to camelCase
  function toCamelCase(inputString) {
    const camelCaseResult = inputString.replace(/\s(.)/g, (_, c) => c.toUpperCase());
    return camelCaseResult.charAt(0).toLowerCase() + camelCaseResult.slice(1);
  }

  // Toggle checkbox state and update form data
  const handleCheckboxChange = (event) => {
    const currentState = formData?.user.workPreferredActivities?.[event.target.name];

    setFormData({
      ...formData,
      user: {
        ...formData.user,
        workPreferredActivities: {
          ...formData?.user?.workPreferredActivities,
          [event.target.name]: !currentState,
        },
      },
    });
  };

  return (
    <div className="work-life-activities-list-jg">
      {workGoalActivities.map((activity, index) => (
        <label
          key={index}
          className={`work-life-activity-checkbox-jg checkbox-jg ${boxSize === "small" ? "work-life-activities-small-jg" : ""}`}
          title={activity.description}
        >
          <input
            type="checkbox"
            name={toCamelCase(activity.title)}
            checked={
              formData?.user?.workPreferredActivities?.[
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
