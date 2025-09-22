import { useState, useRef } from 'react';
import { getProfileColor } from './getProfileColor';
import { FaUpload } from 'react-icons/fa';
import './style.css';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';

const ProfileCircle = ({
  fullName,
  allowUpload = false,
  photoUrl = null,
  onClick = null,
  onImageUpload = null
}) => {
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
  const { user } = useAuth();
  const { id: pathParamId } = useParams();
  const [tempImageUpload, setTempImageUpload] = useState(null);

  // Only allow editing your own photo
  if (user.id !== pathParamId) {
    allowUpload = false;
  }

  const handleClick = () => {
    if (allowUpload) {
      fileInputRef.current?.click();
    }
    if (onClick !== null) {
      onClick();
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target.result; // base64 image

        if (onImageUpload) {
          onImageUpload(imageData);
        }
        setTempImageUpload(imageData);
      };

      reader.readAsDataURL(file);
    }
  };

  // Logic to display the uploaded image before saving.
  const displayPhoto = tempImageUpload || photoUrl;

  return (
    <div
      className="profile-circle"
      style={{ cursor: allowUpload ? 'pointer' : 'default' }}
      onClick={handleClick}
    >
      <div className="profile-icon" style={{ background: bgColor }}>
        {displayPhoto ? (
          <img src={displayPhoto} alt="Profile" className="profile-image" />
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
