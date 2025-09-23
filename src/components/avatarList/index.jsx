import { Link } from 'react-router-dom';
import { SingleLineListItem } from './singleLineListItem';
import './style.css';

export const AvatarList = ({ users, subtitle, contextButton = false }) => {
  return (
    <>
      <hr className="avatar-list-divider" />
      {users.map((u) => (
        <Link to={`/profile/${u.id}`} key={u.id} className="student-link">
          <SingleLineListItem user={u} contextButton={contextButton} />
        </Link>
      ))}
    </>
  );
};
