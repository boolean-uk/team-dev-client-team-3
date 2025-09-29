import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
import Loader from '../../components/loader/Loader';

import {
  valEightChars,
  valCapLetter,
  valNumber,
  valSpecialChar
} from '../register/registrationValidation';

const ProfilePage = () => {
  const { id: pathParamId } = useParams();
  const { user, setUser, onPatchProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(null);
  const location = useLocation();
  const isEditing = location.pathname.endsWith('edit');
  const navigate = useNavigate();
  // const [isEditing, setIsEditing] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const [originalCurrentUser, setOriginalCurrentUser] = useState(user); // The original, before edit, state of the user we are looking at.
  const [tempCurrentUser, setTempCurrentUser] = useState(user); // The edited, under/after edit, state of the user we are looking at.

  // Gets user by ID IFF user is trying to visit someone elses prefilepage!
  useEffect(() => {
    // If ID in user is equal to ID in path param, don't continue in the useEffect.
    // We don't want to continue as we already have the information on the user.
    // We also need to set the externalUser to null, as to make the conditional
    // logic, in for example ProfileBasicInfo, to work as intended.
    if (!pathParamId || String(pathParamId) === String(user.id)) {
      setOriginalCurrentUser(user);
      setTempCurrentUser(user);
      return;
    }

    // Good practice to have an AbortController
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
        setOriginalCurrentUser(data.data);
        setTempCurrentUser(data.data);
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

  useEffect(() => {
    if (!isEditing) {
      setTempCurrentUser(originalCurrentUser);
    }
  }, [isEditing, originalCurrentUser]);

  useEffect(() => {
    const password = tempCurrentUser?.password || '';

    const isValid =
      valEightChars(password) &&
      valCapLetter(password) &&
      valNumber(password) &&
      valSpecialChar(password);

    setCanSave(isValid || password === '');
  }, [tempCurrentUser?.password]);

  // When the editable fields gets changed.
  const handleChange = (field, value) => {
    setTempCurrentUser((prev) => ({ ...prev, [field]: value }));
  };

  // When edit button gets toggled on/off
  const toggleEdit = () => {
    if (isEditing) {
      try {
        tempCurrentUser.id = pathParamId || user.id;

        const { cohort, ...tempCurrentUserWithoutCohort } = tempCurrentUser;

        // If password is empty, we don't want to send it in the body.
        if (tempCurrentUser.password === '') {
          delete tempCurrentUserWithoutCohort.password;
        }

        onPatchProfile(tempCurrentUserWithoutCohort);

        tempCurrentUser.password = '';

        const { password, ...userWithoutPassword } = tempCurrentUser;

        if (!pathParamId || String(pathParamId) === String(user.id)) {
          setUser(userWithoutPassword);
        }

        setOriginalCurrentUser(userWithoutPassword);
        navigate(`/profile/${pathParamId}`);
      } catch (err) {
        console.error('Failed to save profile:', err);
      }
    } else {
      navigate(`/profile/${pathParamId}/edit`);
    }
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <main className="welcome-formheader">
      <Card>
        <div className="profile-container">
          {/* Basic Info */}
          <ProfileBasicInfo
            firstName={tempCurrentUser?.firstName || ''}
            lastName={tempCurrentUser?.lastName || ''}
            username={tempCurrentUser?.username || ''}
            githubUsername={tempCurrentUser?.githubUsername || ''}
            photoUrl={tempCurrentUser?.photo || ''}
            isEditing={isEditing}
            onChange={handleChange}
            onImageUpload={(newPhoto) => {
              setTempCurrentUser((prev) => ({ ...prev, photo: newPhoto }));
            }}
          />

          {/* Training / Professional Info */}
          {originalCurrentUser?.role === 1 && (
            <ProfileProfessionalInfo
              role={tempCurrentUser?.role || ''}
              specialism={tempCurrentUser?.specialism || ''}
              title={tempCurrentUser?.title || ''}
              isEditing={isEditing}
              onChange={handleChange}
            />
          )}
          {originalCurrentUser?.role === 0 && (
            <ProfileTrainingInfo
              role={tempCurrentUser?.role || ''}
              specialism={tempCurrentUser?.specialism || ''}
              cohort={tempCurrentUser?.cohort || ''}
              startDate={tempCurrentUser?.cohort?.startDate || ''}
              endDate={tempCurrentUser?.cohort?.endDate || ''}
              isEditing={isEditing}
              onChange={handleChange}
            />
          )}

          {/* Contact Info */}
          <ProfileContactInfo
            email={tempCurrentUser?.email || ''}
            mobile={tempCurrentUser?.mobile || ''}
            password={tempCurrentUser?.password || ''}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {/* Bio */}
          <ProfileBio
            bio={tempCurrentUser?.bio || ''}
            isEditing={isEditing}
            onChange={handleChange}
          />

          {/* Edit button */}
          <ProfileEditButton isEditing={isEditing} toggleEdit={toggleEdit} canSave={canSave} />
        </div>
      </Card>
    </main>
  );
};

export default ProfilePage;
