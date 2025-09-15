import Form from '../../../components/form';

const ProfileBio = ({
  bio,
  isEditing,
  editableFields,
  onChange,
  onToggle,
  getInputClass,
  maxLength = 300
}) => {
  const isBioEditable = editableFields?.includes('bio') && isEditing;
  const bioClass = `bio ${getInputClass ? getInputClass('bio') : ''}`;

  return (
    <Form>
      <section>
        <h3>Bio</h3>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            className={bioClass}
            maxLength={maxLength}
            id="bio"
            name="bio"
            value={bio || ''}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={!isBioEditable}
          />
          <span id="charCount">
            {bio?.length ?? 0}/{maxLength}
          </span>
        </div>
        <button className="edit-btn" onClick={onToggle} type="button">
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </section>
    </Form>
  );
};

export default ProfileBio;
