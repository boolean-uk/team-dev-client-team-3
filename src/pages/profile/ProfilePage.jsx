import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/card';
import ProfileBio from './bio';
import ProfileContactInfo from './contactInfo';
import ProfileTrainingInfo from './trainingInfo';
import ProfileBasicInfo from './basicInfo';
import ProfileProfessionalInfo from './proffessionalInfo';
import { ProfileEditButton } from './editButton';
import { getUserById } from '../../service/apiClient';

const ProfilePage = () => {
  const { id: pathParamId } = useParams();
  const { user, setUser, onCreateProfile } = useAuth();

  const [externalUser, setExternalUser] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

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

  useEffect(() => {
    if (!pathParamId || !user?.id) return;
    if (String(pathParamId) === String(user.id)) return;

    const controller = new AbortController();

    (async () => {
      setIsLoading(true);
      try {
        const res = await getUserById(pathParamId, { signal: controller.signal });

        if (!res.ok) {
          console.error('Failed to fetch user by id:', res.status);
          return;
        }

        const data = await res.json();
        setExternalUser(data.data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching user by id:', err);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, [pathParamId, user?.id]);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <main className="welcome-formheader">
      <Card>
        <div className="profile-container">
          {/* Basic Info */}
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

          {/* Training / Professional Info */}
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

          {/* Contact Info */}
          <ProfileContactInfo
            email={user.email}
            mobile={user.mobile}
            password={user.password}
            onChange={handleChange}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
          />

          {/* Bio */}
          <ProfileBio
            bio={user.bio}
            isEditing={isEditing}
            editableFields={editableFields}
            onChange={(value) => handleChange('bio', value)}
            getInputClass={getInputClass}
          />

          <ProfileEditButton
            isEditing={isEditing}
            toggleEdit={toggleEdit}
            loggedInUser={user}
            pathParamId={pathParamId}
          />
        </div>
      </Card>
    </main>
  );
};

export default ProfilePage;
