import ProfileCircle from '../../profileCircle';
import './style.css';

export const SingleLineListItem = ({ user, onHover = null, onPressed = null }) => {
  return (
    <>
      {console.log(user)}
      <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} />
      <div>{`${user.firstName} ${user.lastName}`}</div>
      <div>Context Button</div>
    </>
  );
};
