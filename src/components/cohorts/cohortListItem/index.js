const CohortListItem = ({ cohort }) => {
  // TODO: Add icon
  // TODO: Add betteer two-line display of text
  // TODO: Add scroll bar if more than 4 items
  return (
    <div>
      <div className="profile-circle">
        <div className="profile-icon" style={{ background: 'green' }}>
          {<p></p>}
        </div>
      </div>

      <h5>{cohort.name}</h5>
      <br />
      <p>Cohort {cohort.cohort}</p>
    </div>
  );
};

export default CohortListItem;
