import React, { useState } from 'react';
import './style.css';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/card';
import ProfileCircle from '../../components/profileCircle';
import TextInput from '../../components/form/textInput';

const ProfilePage = () => {
  const { user, setUser, onCreateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const editableFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'bio'];

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      onCreateProfile(user);
    }
    setIsEditing((prev) => !prev);
  };

  const getInputClass = (field) => {
    if (!isEditing) return '';
    return editableFields.includes(field) ? 'editable' : 'non-editable';
  };

  return (
    <main className="welcome-formheader">
      <Card>
        <div className="profile-container">

          <form>
            <section>
              <h3>Basic info</h3>
              <div className="welcome-form-inputs">
                <div className="photo-edit-wrapper">
                  <label htmlFor="photo">Photo</label>
                  <ProfileCircle 
                    id="photo"
                    fullName={`${user.firstName} ${user.lastName}`}
                    allowUpload={true} 
                  />
                </div>

                <TextInput
                  label="First Name"
                  name="firstName"
                  value={user.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  className={getInputClass('firstName')}
                  readOnly={!editableFields.includes('firstName') || !isEditing}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={user.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  className={getInputClass('lastName')}
                  readOnly={!editableFields.includes('lastName') || !isEditing}
                />
                <TextInput
                  label="Username"
                  name="username"
                  value={user.username}
                  className={getInputClass('username')}
                  readOnly
                />
                <TextInput
                  label="Github Username"
                  name="githubUsername"
                  value={user.githubUsername}
                  className={getInputClass('githubUsername')}
                  readOnly
                />
              </div>
            </section>
          </form>

          <form>
            <section>
              <h3>Training info</h3>
              <div className="welcome-form-inputs">
                <TextInput label="Role" name="role" value={user.role} className={getInputClass('role')} readOnly />
                <TextInput label="Specialization" name="specialization" value={user.specialization} className={getInputClass('specialization')} readOnly />
                <TextInput label="Cohort" name="cohort" value={user.cohort} className={getInputClass('cohort')} readOnly />
                <TextInput label="Start Date" name="startDate" value={user.startDate} className={getInputClass('startDate')} readOnly />
                <TextInput label="End Date" name="endDate" value={user.endDate} className={getInputClass('endDate')} readOnly />
              </div>
            </section>
          </form>

          <form>
            <section>
              <h3>Contact info</h3>
              <div className="welcome-form-inputs">
                <TextInput
                  label="Email"
                  name="email"
                  value={user.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={getInputClass('email')}
                  readOnly={!editableFields.includes('email') || !isEditing}
                />
                <TextInput
                  label="Mobile"
                  name="mobile"
                  value={user.mobile}
                  onChange={e => handleChange('mobile', e.target.value)}
                  className={getInputClass('mobile')}
                  readOnly={!editableFields.includes('mobile') || !isEditing}
                />
                <TextInput
                  label="Password"
                  name="password"
                  value={user.password}
                  onChange={e => handleChange('password', e.target.value)}
                  className={getInputClass('password')}
                  readOnly={!editableFields.includes('password') || !isEditing}
                />
              </div>
            </section>
          </form>

          <form>
            <section>
              <h3>Bio</h3>
              <div>
                <label htmlFor="bio">Bio</label>
                <textarea
                  className={`bio ${getInputClass('bio')}`}
                  maxLength={300}
                  id="bio"
                  name="bio"
                  value={user.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  readOnly={!editableFields.includes('bio') || !isEditing}
                />
                <span id="charCount">{user.bio.length}/300</span>
              </div>
              <button type="button" className="edit-btn" onClick={toggleEdit}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </section>
          </form>

        </div>
      </Card>
    </main>
  );
};

export default ProfilePage;
