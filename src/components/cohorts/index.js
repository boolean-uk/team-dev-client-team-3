import CohortListItem from './cohortListItem';
import './style.css';

const Cohorts = ({ data, onSelectCohort }) => {
  return (
    <>
      <hr className="avatar-list-divider" />
      <div className="cohorts-list-container">
        {data.map((cohort, index) => (
          <CohortListItem
            key={index}
            cohort={cohort}
            onClick={() => onSelectCohort && onSelectCohort(cohort)}
          />
        ))}
      </div>
    </>
  );
};

export default Cohorts;
