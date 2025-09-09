import { SingleLineListItem } from './singleLineListItem';
import './style.css';

export const AvatarList = ({ users }) => {
  return (
    <>
      {users.map((u) => (
        <SingleLineListItem key={u.id} user={u} />
      ))}
    </>
  );
};
