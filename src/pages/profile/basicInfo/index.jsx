import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import ProfileCircle from '../../../components/profileCircle';
import useAuth from '../../../hooks/useAuth';
import { getInputClass, canEditField } from '../helpers';
import './styles.css';

const ProfileBasicInfo = ({
  firstName,
  lastName,
  username,
  githubUsername,
  photoUrl,
  isEditing,
  onChange,
  onImageUpload
}) => {
  // We need the logged in user so that we can check if they can edit.
  const { user } = useAuth();

  return (
    <Form>
      <section>
        <h3>Basic info</h3>
        <div className="welcome-form-inputs">
          <div className="photo-edit-wrapper">
            <label htmlFor="photo">
              Photo
              <ProfileCircle
                id="photo"
                fullName={`${firstName || ''} ${lastName || ''}`.trim()}
                allowUpload={canEditField('photo', isEditing, user.role)}
                canClick={canEditField('photo', isEditing, user.role)}
                photoUrl={photoUrl || null}
                onImageUpload={onImageUpload}
              />
            </label>
          </div>

          <TextInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            className={getInputClass('firstName', isEditing, user.role)}
            disabled={!canEditField('firstName', isEditing, user.role)}
          />

          <TextInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            className={getInputClass('lastName', isEditing, user.role)}
            disabled={!canEditField('lastName', isEditing, user.role)}
          />

          <TextInput
            label="Username"
            name="username"
            value={username}
            onChange={(e) => onChange('username', e.target.value)}
            className={getInputClass('username', isEditing, user.role)}
            disabled={!canEditField('username', isEditing, user.role)}
          />

          <TextInput
            label="Github Username"
            name="githubUsername"
            value={githubUsername}
            onChange={(e) => onChange('githubUsername', e.target.value)}
            className={getInputClass('githubUsername', isEditing, user.role)}
            disabled={!canEditField('githubUsername', isEditing, user.role)}
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileBasicInfo;
