import { Link } from 'react-router-dom';
import { SingleLineListItem } from '../avatarList/singleLineListItem';
import './style.css';

const Students = ({ data }) => {
  return (
    <>
      <h4>Students</h4>
      <hr className="avatar-list-divider" />
      <div className="students-list-container">
        {data.map((student) => (
          <Link to={`/profile/${student.id}`} key={student.id} className="student-link">
            <SingleLineListItem user={student} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Students;
