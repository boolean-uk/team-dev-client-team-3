import { useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

export const ProfileEditButton = ({ isEditing, toggleEdit, canSave }) => {
  const { id: pathParamId } = useParams();
  const { user } = useAuth();

  const isOwnProfile = !pathParamId || String(pathParamId) === String(user.id);

  if (user.role !== 1 && !isOwnProfile) return null;

  return (
    <button
      className="edit-btn"
      onClick={toggleEdit}
      type="button"
      disabled={!canSave && isEditing}
    >
      {isEditing ? 'Save' : 'Edit'}
    </button>
  );
};
