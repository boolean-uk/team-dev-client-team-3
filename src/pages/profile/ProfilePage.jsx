import React, { useState } from 'react';
import './style.css';
import TextInput from '../../components/form/textInput';
import Form from '../../components/form';
import ProfileCircle from '../../components/profileCircle';

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState({
    firstName: storedUser.firstName || '',
    lastName: storedUser.lastName || '',
    username: storedUser.username || '',
    githubUsername: storedUser.githubUsername || '',
    role: storedUser.role || 'student',
    specialization: storedUser.specialization || 'frontend',
    cohort: storedUser.cohort || 'cohort 3',
    startDate: storedUser.startDate || 'someDate',
    endDate: storedUser.endDate || 'someDate',
    email: storedUser.email || '',
    mobile: storedUser.mobile || '',
    password: storedUser.password || '',
    bio: storedUser.bio || ''
  });

  const handleChange = (field, value) => {
  const updatedUser = { ...user, [field]: value };
  setUser(updatedUser);
  localStorage.setItem('user', JSON.stringify(updatedUser));
};


  return (
    <>
      <main className="welcome-formheader profile-container">
        <Form>
          <section>
            <h3>Basic info</h3>
            <div className="welcome-form-inputs">
              <div>
                <label htmlFor="photo">Photo</label>
                <ProfileCircle
                  id="photo"
                  fullName={user.firstName + ' ' + user.lastName}
                  showMenu={false}
                />
              </div>
              <TextInput label={'First Name'} name="firstName" value={user.firstName} onChange={e => handleChange('firstName', e.target.value)} />
              <TextInput label={'Last Name'} name="lastName" value={user.lastName} onChange={e => handleChange('lastName', e.target.value)} />
              <TextInput label={'Username'} name="username" value={user.username} />
              <TextInput label={'Github Username'} name="githubName" value={user.githubUsername} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Training info</h3>
            <div className="welcome-form-inputs">
              <TextInput label={'Role'} name="role" value={user.role} />
              <TextInput
                label={'Specialization'}
                name="specialization"
                value={user.specialization}
              />
              <TextInput label={'Cohort'} name="cohort" value={user.cohort} />
              <TextInput label={'Start Date'} name="startDate" value={user.startDate} />
              <TextInput label={'End Date'} name="endDate" value={user.endDate} />
            </div>
          </section>
        </Form>
        <Form>
          <section>
            <h3>Contact info</h3>
            <div className="welcome-form-inputs">
              <TextInput label={'Email'} name="email" value={user.email} />
              <TextInput label={'Mobile'} name="mobile" value={user.mobile} />
              <TextInput label={'Password'} name="password" value={user.password} />
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
                value={user.bio}
                onChange={e => handleChange('bio', e.target.value)}
              ></textarea>
              <span id="charCount">{user.bio ? user.bio.length : 0}/300</span>
            </div>
          </section>
        </Form>
      </main>
    </>
  );
};

export default ProfilePage;
