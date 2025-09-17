import { useState, useRef, useEffect } from 'react';
import { getProfileColor } from './getProfileColor';
import { FaUpload } from 'react-icons/fa';
import './style.css';
import { patchUser } from '../../service/apiClient';

const ProfileCircle = ({ fullName, allowUpload = false, photoUrl = null }) => {
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
  const fileInputRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [user, setUser] = useState({ ...storedUser, photo: photoUrl });

  useEffect(() => {
    if (photoUrl) {
      setUser((prev) => ({ ...prev, photo: photoUrl }));
    }
  }, [photoUrl]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result; // base64 image

        // 1️⃣ Update local state immediately
        setUser((prev) => ({ ...prev, photo: imageData }));

        // 2️⃣ Update localStorage
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        const updatedUser = { ...storedUser, photo: imageData };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // 3️⃣ Update backend
        try {
          await patchUser(storedUser.id, imageData);
          console.log('Photo updated successfully');
        } catch (err) {
          console.error('Failed to update photo', err);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="profile-circle"
      style={{ cursor: allowUpload ? 'pointer' : 'default' }}
      onClick={() => allowUpload && fileInputRef.current?.click()}
    >
      <div className="profile-icon" style={{ background: bgColor }}>
        {user.photo ? (
          <img src={user.photo} alt="Profile" className="profile-image" />
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
