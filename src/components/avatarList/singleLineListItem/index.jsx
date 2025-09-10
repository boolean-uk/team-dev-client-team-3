import ProfileCircle from '../../profileCircle';
import { PiDotsThree } from 'react-icons/pi';
import './style.css';

export const SingleLineListItem = ({ user, onPressed = null, contextButton = false }) => {
  return (
    <div className="single-line-list-item">
      <ProfileCircle className={'profile-circle'} fullName={`${user.firstName} ${user.lastName}`} />
      <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
      {contextButton ? <PiDotsThree className="context-btn" /> : null}
    </div>
  );
};
