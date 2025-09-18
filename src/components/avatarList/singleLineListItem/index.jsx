import ProfileCircle from '../../profileCircle';
import { PiDotsThree } from 'react-icons/pi';
import './style.css';

export const SingleLineListItem = ({ user, contextButton = false }) => {
  return (
    <div className="single-line-list-item">
      <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} photoUrl={user.photo} />
      <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
      {contextButton ? <PiDotsThree className="context-btn" /> : null}
    </div>
  );
};
