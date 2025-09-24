import ProfileCircle from '../../profileCircle';
import './style.css';

export const SingleLineListItem = ({ user, contextButton = false }) => {
  return (
    <div className="single-line-list-item">
      <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} photoUrl={user.photo} />
      <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
    </div>
  );
};
