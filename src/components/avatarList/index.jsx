import { SingleLineListItem } from './singleLineListItem';
import './style.css';

export const AvatarList = ({ users, subtitle, contextButton = false }) => {
  return (
    <>
      <p className="avatar-list-subtitle">{subtitle}</p>
      <hr className="avatar-list-divider" />
      {users.map((u) => (
        <SingleLineListItem key={u.id} user={u} contextButton={contextButton} />
      ))}
    </>
  );
};
