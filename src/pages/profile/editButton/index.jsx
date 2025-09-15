export const ProfileEditButton = ({ isEditing, toggleEdit, loggedInUser, pathParamId }) => {
  return (
    <>
      {loggedInUser.role === 1 ? (
        <button className="edit-btn" onClick={toggleEdit} type="button">
          {isEditing ? 'Save' : 'Edit'}
        </button>
      ) : null}
    </>
  );
};
