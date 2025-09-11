import React, { useState } from 'react';
import './style.css';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/card';
import ProfileBio from './bio';
import ProfileContactInfo from './contactInfo';
import ProfileTrainingInfo from './trainingInfo';
import ProfileBasicInfo from './basicInfo';
import ProfileProfessionalInfo from './proffessionalInfo';

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
          <ProfileBasicInfo
            firstName={user.firstName}
            lastName={user.lastName}
            username={user.username}
            githubUsername={user.githubUsername}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
            onChange={handleChange}
          />

          {user.role === 1 ? (
            <ProfileProfessionalInfo
              role="Teacher"
              specialization={user.specialism}
              title={user.title}
            />
          ) : user.role === 0 ? (
            <ProfileTrainingInfo
              role="Student"
              specialization={user.specialism}
              cohort={user.cohort}
              startDate={user.startDate}
              endDate={user.endDate}
              getInputClass={getInputClass}
            />
          ) : null}

          <ProfileContactInfo
            email={user.email}
            mobile={user.mobile}
            password={user.password}
            onChange={handleChange}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
          />

          <ProfileBio
            bio={user.bio}
            isEditing={isEditing}
            editableFields={editableFields}
            onChange={(value) => handleChange('bio', value)}
            onToggle={toggleEdit}
            getInputClass={getInputClass}
          />
        </div>
      </Card>
    </main>
  );
};

export default ProfilePage;
