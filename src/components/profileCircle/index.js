import { useState, useRef, useEffect } from 'react';
import { getProfileColor } from './getProfileColor';
import { FaUpload } from 'react-icons/fa';
import './style.css';
import { patchUser } from '../../service/apiClient';

const ProfileCircle = ({ fullName, allowUpload = false, photoUrl = null, userId = null }) => {
  const getInitials = (fullName) => {
    if (!fullName) return 'NaN';
    const names = fullName
      .trim()
      .split(' ')
      .filter((n) => n);
    if (names.length === 0) return 'NaN';
    if (names.length === 1) return names[0][0].toUpperCase();
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
  };

  const initials = getInitials(fullName);
  const [bgColor] = useState(() => getProfileColor(initials));
  const [userPhoto, setUserPhoto] = useState(photoUrl || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (photoUrl) setUserPhoto(photoUrl);
  }, [photoUrl]);

  const handleImageUpload = async (event) => {
    if (!allowUpload || !userId) return; // only allow for your own profile
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target.result;
      setUserPhoto(imageUrl);
      localStorage.setItem('user', JSON.stringify({ id: userId, photo: imageUrl }));

      try {
        await patchUser(userId, imageUrl);
        console.log('Photo updated successfully');
      } catch (err) {
        console.error('Failed to update photo', err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="profile-circle"
      style={{ cursor: allowUpload ? 'pointer' : 'default' }}
      onClick={() => allowUpload && fileInputRef.current?.click()}
    >
      <div className="profile-icon" style={{ background: bgColor }}>
        {userPhoto ? (
          <img src={userPhoto} alt="Profile" className="profile-image" />
        ) : (
          <p>{initials}</p>
        )}
        {allowUpload && (
          <div className="overlay">
            <FaUpload className="upload-icon" />
          </div>
        )}
      </div>

      {allowUpload && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      )}
    </div>
  );
};

export default ProfileCircle;
