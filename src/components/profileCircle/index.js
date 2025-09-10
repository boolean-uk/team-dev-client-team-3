import { useState, useMemo } from 'react';
import { getProfileColor } from './getProfileColor';
import './style.css';

const ProfileCircle = ({ fullName, showMenu = true }) => {
  const getInitials = (fullName) => {
    if (!fullName) return 'NaN';

    const names = fullName
      .trim()
      .split(' ')
      .filter((n) => n);
    if (names.length === 0) return 'NaN';
    if (names.length === 1) return names[0][0].toUpperCase();

    const firstInitial = names[0][0].toUpperCase();
    const lastInitial = names[names.length - 1][0].toUpperCase();
    return firstInitial + lastInitial;
  };

  const initials = getInitials(fullName);

  const [bgColor] = useState(() => getProfileColor(initials));

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <div className="profile-circle" onClick={() => showMenu && setIsMenuVisible(!isMenuVisible)}>
      <div className="profile-icon" style={{ background: bgColor }}>
        <p>{initials}</p>
      </div>
    </div>
  );
};

export default ProfileCircle;
