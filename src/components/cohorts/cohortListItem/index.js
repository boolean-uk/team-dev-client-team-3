const CohortListItem = ({ cohort }) => {
  return (
    <div>
    <div className="profile-circle">
              <div className="profile-icon" style={{ background: "green" }}>
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
