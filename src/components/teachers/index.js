import { Link } from 'react-router-dom';
import { SingleLineListItem } from '../avatarList/singleLineListItem';
import './style.css';

const Teachers = ({ data }) => {
  return (
    <>
      <h4>Teachers</h4>
      <hr className="avatar-list-divider" />
      <div className="teachers-list-container">
        {data.map((teacher) => (
          <Link to={`/profile/${teacher.id}`} key={teacher.id} className="teacher-link">
            <SingleLineListItem user={teacher} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Teachers;
