import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import ProfileCircle from '../../../components/profileCircle';

const ProfileBasicInfo = ({
  firstName,
  lastName,
  username,
  githubUsername,
  photoUrl,
  isEditing,
  editableFields = [],
  getInputClass = () => '',
  onChange
}) => {
  return (
    <Form>
      <section>
        <h3>Basic info</h3>
        <div className="welcome-form-inputs">
          <div className="photo-edit-wrapper">
            <label htmlFor="photo">Photo</label>
            {photoUrl ? (
              <ProfileCircle
                id="photo"
                fullName={`${firstName || ''} ${lastName || ''}`.trim()}
                allowUpload={true}
                photoUrl={photoUrl}
              />
            ) : (
              <ProfileCircle
                id="photo"
                fullName={`${firstName || ''} ${lastName || ''}`.trim()}
                allowUpload={true}
              />
            )}
          </div>

          <TextInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={getInputClass('firstName')}
            disabled={!editableFields.includes('firstName') || !isEditing}
          />

          <TextInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={getInputClass('lastName')}
            disabled={!editableFields.includes('lastName') || !isEditing}
          />

          <TextInput
            label="Username"
            name="username"
            value={username}
            className={getInputClass('username')}
            disabled
          />

          <TextInput
            label="Github Username"
            name="githubUsername"
            value={githubUsername}
            className={getInputClass('githubUsername')}
            disabled
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileBasicInfo;
