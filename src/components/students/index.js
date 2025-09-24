import { Link } from 'react-router-dom';
import { SingleLineListItem } from '../avatarList/singleLineListItem';
import './style.css';

const Students = ({ data = [] }) => (
  <div className="students-card">
    <h4>Students</h4>
    <hr className="avatar-list-divider" />
    <div className="students-list">
      {data.map((student, index) => (
        <Link to={`/profile/${student.id}`} key={`${student.id}-${index}`} className="student-link">
          <SingleLineListItem user={student} />
        </Link>
      ))}
    </div>
  </div>
);

export default Students;
