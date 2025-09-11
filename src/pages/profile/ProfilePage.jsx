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
  const { user, onCreateProfile } = useAuth();
  const [localUser, setLocalUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const editableFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'bio'];

  const handleChange = (field, value) => {
    setLocalUser((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      onCreateProfile(localUser);
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
            firstName={localUser.firstName}
            lastName={localUser.lastName}
            username={localUser.username}
            githubUsername={localUser.githubUsername}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
            onChange={handleChange}
          />

          {localUser.role === 1 ? (
            <ProfileProfessionalInfo
              role={'Teacher'}
              specialization={localUser.specialism}
              title={localUser.title}
            />
          ) : (
            <ProfileTrainingInfo
              role={'Student'}
              specialization={localUser.specialism}
              cohort={localUser.cohort}
              startDate={localUser.startDate}
              endDate={localUser.endDate}
              getInputClass={getInputClass}
            />
          )}

          <ProfileContactInfo
            email={localUser.email}
            mobile={localUser.mobile}
            password={localUser.password}
            onChange={handleChange}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
          />

          <ProfileBio
            bio={localUser.bio}
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
