export default function SidePanelRecommendations({ eventType }) {
  // TODO: Pass the user and the eventType here
  // TODO: Get the user's preferred activities for the eventType
  // TODO: Cross it with the user's availability
  // TODO: Cross it stored suggestions in database
  // TODO: Display the suggestions

  return (
    <div className="side-panel-recommendation-list-jg">
      <hr
        className={
          eventType === "Work"
            ? "side-panel-hr-jg work-hr-jg"
            : "side-panel-hr-jg life-hr-jg"
        }
      />
      <p className="side-panel-recommendation-text-jg">Establish specific work hours and stick to them to prevent work from encroaching on personal time.</p>
      <p className="side-panel-recommendation-text-jg">Schedule regular breaks and ensure time for activities that recharge you outside of work.</p>
      <p className="side-panel-recommendation-text-jg">Don't hesitate to decline additional work when it jeopardizes your well-being or family time.</p>
      <p className="side-panel-recommendation-text-jg">Separate your work environment from personal spaces to mentally disconnect at the end of the day.</p>
      <p className="side-panel-recommendation-text-jg">Designate periods without devices to foster real-life connections and reduce stress.</p>
    </div>
  );
}
