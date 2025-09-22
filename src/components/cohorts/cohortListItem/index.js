import { FaUsers } from 'react-icons/fa';
import './style.css';

const CohortListItem = ({ cohort, onClick }) => {
  return (
    <div className="cohort-list-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="cohort-avatar">
        {cohort.icon ? (
          <img src={cohort.icon} alt={`${cohort.title} icon`} className="cohort-icon" />
        ) : (
          <FaUsers className="cohort-icon" />
        )}
      </div>
      <div className="cohort-text">
        <h5 className="cohort-name">{cohort.title}</h5> {/* use .title */}
      </div>
    </div>
  );
};

export default CohortListItem;
