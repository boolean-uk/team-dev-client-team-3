import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/card';
import ProfileBio from './bio';
import ProfileContactInfo from './contactInfo';
import ProfileTrainingInfo from './trainingInfo';
import ProfileBasicInfo from './basicInfo';
import ProfileProfessionalInfo from './professionalInfo';
import { ProfileEditButton } from './editButton';
import { getUserById } from '../../service/apiClient';

const ProfilePage = () => {
  const { id: pathParamId } = useParams();
  const { user, setUser, onPatchProfile } = useAuth();

  const [externalUser, setExternalUser] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const editableFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'bio'];

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      onPatchProfile(user);
    }
    setIsEditing((prev) => !prev);
  };

  const getInputClass = (field) => {
    if (!isEditing) return '';
    return editableFields.includes(field) ? 'editable' : 'non-editable';
  };

  // Gets user by ID IFF user is trying to visit someone elses prefilepage!
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

  const viewUser = externalUser ?? user;
  const isTeacher = viewUser?.role === 1;
  const isStudent = viewUser?.role === 0;

  if (isLoading) {
    return <>Loading...</>; // consider a cute loading animation
  }

  return (
    <main className="welcome-formheader">
      <Card>
        <div className="profile-container">
          <ProfileBasicInfo
            firstName={viewUser.firstName}
            lastName={viewUser.lastName}
            username={viewUser.username}
            githubUsername={viewUser.githubUsername}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
            onChange={handleChange}
          />

          {/* Training / Professional Info */}
          {isTeacher && (
            <ProfileProfessionalInfo
              role="Teacher"
              specialization={viewUser.specialism}
              title={viewUser.title}
            />
          )}
          {isStudent && (
            <ProfileTrainingInfo
              role="Student"
              specialization={viewUser.specialism}
              cohort={viewUser.cohort}
              startDate={viewUser.startDate}
              endDate={viewUser.endDate}
              getInputClass={getInputClass}
            />
          )}

          {/* Contact Info */}
          <ProfileContactInfo
            email={viewUser.email}
            mobile={viewUser.mobile}
            password={viewUser.password}
            onChange={handleChange}
            isEditing={isEditing}
            editableFields={editableFields}
            getInputClass={getInputClass}
          />

          {/* Bio */}
          <ProfileBio
            bio={viewUser.bio}
            isEditing={isEditing}
            editableFields={editableFields}
            onChange={(value) => handleChange('bio', value)}
            getInputClass={getInputClass}
          />

          {/* Edit button */}
          <ProfileEditButton
            isEditing={isEditing}
            toggleEdit={toggleEdit}
            loggedInUser={viewUser}
            pathParamId={pathParamId}
          />
        </div>
      </Card>
    </main>
  );
};

export default ProfilePage;
