export const ProfileEditButton = ({ isEditing, toggleEdit, loggedInUser, pathParamId }) => {
  const isOwnProfile = pathParamId && String(pathParamId) === String(loggedInUser?.id);
  const canEdit = loggedInUser?.role === 1 || isOwnProfile;

  if (!canEdit) return null;

  return (
    <button className="edit-btn" onClick={toggleEdit} type="button">
      {isEditing ? 'Save' : 'Edit'}
    </button>
  );
};
