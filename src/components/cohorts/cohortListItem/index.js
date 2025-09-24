import { FaUsers } from 'react-icons/fa';
import { PiBracketsAngle } from 'react-icons/pi';
import { RiComputerFill } from 'react-icons/ri';
import { AiOutlineStock } from 'react-icons/ai';
import './style.css';

const CohortListItem = ({ cohort, onClick }) => {
  let IconComponent = FaUsers;
  let bgColor = '#28a745';

  if (cohort.title === 'Software Development') {
    IconComponent = PiBracketsAngle;
    bgColor = '#81fc9eff';
  } else if (cohort.title === 'Front-End Development') {
    IconComponent = RiComputerFill;
    bgColor = '#ba94ffff';
  } else if (cohort.title === 'Data Analytics') {
    IconComponent = AiOutlineStock;
    bgColor = '#56a4f8ff';
  }
  return (
    <div className="cohort-list-item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="cohort-avatar" style={{ backgroundColor: bgColor }}>
        <IconComponent className="cohort-icon" />
      </div>
      <div className="cohort-text">
        <h5 className="cohort-name">{cohort.courseTitle || cohort.title}</h5>
        <small className="cohort-subtitle">{cohort.cohortTitle}</small>
      </div>
    </div>
  );
};

export default CohortListItem;
