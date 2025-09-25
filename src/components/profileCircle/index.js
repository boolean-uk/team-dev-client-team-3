import { useState, useRef, useMemo, useCallback } from 'react';
import { getProfileColor } from './getProfileColor';
import { FaUpload } from 'react-icons/fa';
import './style.css';
import useAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';

/** Derive initials from a full name like "Ada Lovelace" -> "AL". */
const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return `${parts[0][0].toUpperCase()}${parts[parts.length - 1][0].toUpperCase()}`;
};

const ProfileCircle = ({
  fullName,
  allowUpload = false,
  photoUrl = null,
  canClick = true,
  onClick,
  onImageUpload
}) => {
  const { user } = useAuth();
  const { id: pathParamId } = useParams();
  const fileInputRef = useRef(null);

  // Only allow editing your own photo
  const canUpload = Boolean(allowUpload && user?.id === pathParamId);

  const initials = useMemo(() => getInitials(fullName), [fullName]);
  const bgColor = useMemo(() => getProfileColor(initials), [initials]);

  // Preview uploaded image before saving.
  const [previewSrc, setPreviewSrc] = useState(null);
  const displayPhoto = previewSrc || photoUrl;

  const openFilePicker = useCallback(() => {
    if (canUpload) fileInputRef.current?.click();
  }, [canUpload]);

  const handleClick = useCallback(() => {
    if (canUpload) openFilePicker();
    onClick?.();
  }, [canUpload, openFilePicker, onClick]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  const handleImageUpload = useCallback(
    (event) => {
      const file = event.target?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result;
        if (typeof dataUrl === 'string') {
          onImageUpload?.(dataUrl); // pass base64 up if provided
          setPreviewSrc(dataUrl); // show preview immediately
        }
      };
      reader.readAsDataURL(file);

      // Allow re-uploading the same file by resetting the input value.
      event.target.value = '';
    },
    [onImageUpload]
  );

  return (
    <div
      className="profile-circle"
      style={{ cursor: canUpload || canClick ? 'pointer' : 'default' }}
      role="button"
      tabIndex={0}
      aria-label={canUpload ? 'Upload profile photo' : 'Profile'}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="profile-icon" style={{ background: bgColor }}>
        {displayPhoto ? (
          <img src={displayPhoto} alt="Profile" className="profile-image" />
        ) : (
          <p>{initials}</p>
        )}

        {canUpload && (
          <div className="overlay" aria-hidden="true">
            <FaUpload className="upload-icon" />
          </div>
        )}
      </div>

      {canUpload && (
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
