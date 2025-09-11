import React, { useState } from 'react';
import './style.css';
import TextInput from '../../components/form/textInput';
import Form from '../../components/form';
import ProfileCircle from '../../components/profileCircle';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/card';

const ProfilePage = () => {
  const { user, onCreateProfile } = useAuth();
  const [localUser, setLocalUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const editableFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'bio'];
  const handleChange = (field, value) => {
    setLocalUser(prev => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      onCreateProfile(localUser);
    }
    setIsEditing(prev => !prev);
  };

  const getInputClass = (field) => {
    if (!isEditing) return '';
    return editableFields.includes(field) ? 'editable' : 'non-editable';
  };

  return (
    <main className="welcome-formheader">
      <Card>
        <div className="profile-container">
          <Form>
            <section>
              <h3>Basic info</h3>
              <div className="welcome-form-inputs">
                <div className="photo-edit-wrapper">
                  <label htmlFor="photo">Photo</label>
                  <ProfileCircle 
                    id="photo"
                    fullName={`${localUser.firstName} ${localUser.lastName}`}
                    allowUpload={true} 
                  />
                </div>

                <TextInput
                  label="First Name"
                  name="firstName"
                  value={localUser.firstName}
                  onChange={e => handleChange('firstName', e.target.value)}
                  className={getInputClass('firstName')}
                  disabled={!editableFields.includes('firstName') || !isEditing}
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  value={localUser.lastName}
                  onChange={e => handleChange('lastName', e.target.value)}
                  className={getInputClass('lastName')}
                  disabled={!editableFields.includes('lastName') || !isEditing}
                />
                <TextInput
                  label="Username"
                  name="username"
                  value={localUser.username}
                  className={getInputClass('username')}
                  disabled
                />
                <TextInput
                  label="Github Username"
                  name="githubUsername"
                  value={localUser.githubUsername}
                  className={getInputClass('githubUsername')}
                  disabled
                />
              </div>
            </section>
          </Form>


          <Form>
            <section>
              <h3>Training info</h3>
              <div className="welcome-form-inputs">
                <TextInput
                  label="Role"
                  name="role"
                  value={localUser.role}
                  className={getInputClass('role')}
                  disabled
                />
                <TextInput
                  label="Specialization"
                  name="specialization"
                  value={localUser.specialization}
                  className={getInputClass('specialization')}
                  disabled
                />
                <TextInput
                  label="Cohort"
                  name="cohort"
                  value={localUser.cohort}
                  className={getInputClass('cohort')}
                  disabled
                />
                <TextInput
                  label="Start Date"
                  name="startDate"
                  value={localUser.startDate}
                  className={getInputClass('startDate')}
                  disabled
                />
                <TextInput
                  label="End Date"
                  name="endDate"
                  value={localUser.endDate}
                  className={getInputClass('endDate')}
                  disabled
                />
              </div>
            </section>
          </Form>

          <Form>
            <section>
              <h3>Contact info</h3>
              <div className="welcome-form-inputs">
                <TextInput
                  label="Email"
                  name="email"
                  value={localUser.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={getInputClass('email')}
                  disabled={!editableFields.includes('email') || !isEditing}
                />
                <TextInput
                  label="Mobile"
                  name="mobile"
                  value={localUser.mobile}
                  onChange={e => handleChange('mobile', e.target.value)}
                  className={getInputClass('mobile')}
                  disabled={!editableFields.includes('mobile') || !isEditing}
                />
                <TextInput
                  label="Password"
                  name="password"
                  value={localUser.password}
                  onChange={e => handleChange('password', e.target.value)}
                  className={getInputClass('password')}
                  disabled={!editableFields.includes('password') || !isEditing}
                />
              </div>
            </section>
          </Form>

          <Form>
            <section>
              <h3>Bio</h3>
              <div>
                <label htmlFor="bio">Bio</label>
                <textarea
                  className={`bio ${getInputClass('bio')}`}
                  maxLength={300}
                  id="bio"
                  name="bio"
                  value={localUser.bio}
                  onChange={e => handleChange('bio', e.target.value)}
                  disabled={!editableFields.includes('bio') || !isEditing}
                />
                <span id="charCount">{localUser.bio.length}/300</span>
              </div>
              <button className="edit-btn" onClick={toggleEdit}>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            </section>
          </Form>
        </div>

      </Card>



    </main>
  );
};

export default ProfilePage;
