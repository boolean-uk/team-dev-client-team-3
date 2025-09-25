import { Link } from 'react-router-dom';
import { SingleLineListItem } from '../avatarList/singleLineListItem';
import './style.css';

const Teachers = ({ data = [], listClassName = 'teachers-list-container' }) => {
  return (
    <>
      <h4>Teachers</h4>
      <hr className="avatar-list-divider" />
      <div className={listClassName}>
        {data.map((teacher, index) => (
          <Link
            to={`/profile/${teacher.id}`}
            key={`${teacher.id}-${index}`}
            className="teacher-link"
          >
            <SingleLineListItem user={teacher} />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Teachers;
