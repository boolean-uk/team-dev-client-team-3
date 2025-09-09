import React, { useState } from 'react';
import './style.css';
import TextInput from '../../components/form/textInput';
import Form from '../../components/form';
import ProfileCircle from '../../components/profileCircle';
import useAuth from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth(); // get the current user

  const [localUser, setLocalUser] = useState({ ...user });

  const handleChange = (field, value) => {
    setLocalUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <main className="welcome-formheader profile-container">
      <Form>
        <section>
          <h3>Basic info</h3>
          <div className="welcome-form-inputs">
            <div>
              <label htmlFor="photo">Photo</label>
              <ProfileCircle
                id="photo"
                fullName={`${localUser.firstName} ${localUser.lastName}`}
                showMenu={false}
              />
            </div>
            <TextInput
              label="First Name"
              name="firstName"
              value={localUser.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
            />
            <TextInput
              label="Last Name"
              name="lastName"
              value={localUser.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
            />
            <TextInput
              label="Username"
              name="username"
              value={localUser.username}
            />
            <TextInput
              label="Github Username"
              name="githubUsername"
              value={localUser.githubUsername}
            />
          </div>
        </section>
      </Form>

      <Form>
        <section>
          <h3>Training info</h3>
          <div className="welcome-form-inputs">
            <TextInput label="Role" name="role" value={localUser.role} />
            <TextInput label="Specialization" name="specialization" value={localUser.specialization}/>
            <TextInput label="Cohort" name="cohort" value={localUser.cohort} />
            <TextInput label="Start Date" name="startDate" value={localUser.startDate}/>
            <TextInput label="End Date" name="endDate" value={localUser.endDate} />
          </div>
        </section>
      </Form>

      <Form>
        <section>
          <h3>Contact info</h3>
          <div className="welcome-form-inputs">
            <TextInput label="Email" name="email" value={localUser.email} onChange={e => handleChange('email', e.target.value)} />
            <TextInput label="Mobile" name="mobile" value={localUser.mobile} onChange={e => handleChange('mobile', e.target.value)} />
            <TextInput label="Password" name="password" value={localUser.password} onChange={e => handleChange('password', e.target.value)} />
          </div>
        </section>
      </Form>

      <Form>
        <section>
          <h3>Bio</h3>
          <div>
            <label htmlFor="bio">Bio</label>
            <textarea
              className="bio"
              maxLength={300}
              id="bio"
              name="bio"
              value={localUser.bio}
              onChange={e => handleChange('bio', e.target.value)}
            />
            <span id="charCount">{localUser.bio.length}/300</span>
          </div>
        </section>
      </Form>
    </main>
  );
};

export default ProfilePage;
