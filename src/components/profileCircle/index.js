import { useState, useEffect, useRef } from 'react';
import { getProfileColor } from './getProfileColor';
import { FaUpload } from 'react-icons/fa';
import './style.css';

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

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;
  const storageKey = `profileImage-${userId}`;

  const [image, setImage] = useState(photoUrl);

  useEffect(() => {
    const storedImage = localStorage.getItem(storageKey);
    if (storedImage) setImage(storedImage);
  }, [storageKey]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImage(imageData);
        localStorage.setItem(storageKey, imageData);
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
        {image ? <img src={image} alt="Profile" className="profile-image" /> : <p>{initials}</p>}
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
