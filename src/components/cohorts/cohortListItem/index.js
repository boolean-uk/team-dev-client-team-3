import { FaUsers } from 'react-icons/fa';
import './style.css';

const CohortListItem = ({ cohort }) => {
  return (
    <div className="cohort-list-item">
      <div className="cohort-avatar">
        {cohort.icon ? (
          <img src={cohort.icon} alt={`${cohort.name} icon`} className="cohort-icon" />
        ) : (
          <FaUsers className="cohort-icon" />
        )}
      </div>
      <div className="cohort-text">
        <h5 className="cohort-name">{cohort.name}</h5>
        <p className="cohort-label">Cohort {cohort.cohort}</p>
      </div>
    </div>
  );
};

export default CohortListItem;
