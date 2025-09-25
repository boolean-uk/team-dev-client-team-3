import { useState, useRef, useEffect, useContext } from 'react';
import FullLogo from '../../assets/fullLogo';
import useAuth from '../../hooks/useAuth';
import './style.css';
import Card from '../card';
import ProfileIcon from '../../assets/icons/profileIcon';
import LogoutIcon from '../../assets/icons/logoutIcon';
import { NavLink } from 'react-router-dom';
import ProfileCircle from '../profileCircle';
import { AuthContext } from '../../context/auth';

const Header = () => {
  const { token, onLogout, user } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const contextValues = useContext(AuthContext);
  const storedUser = contextValues.user;
  const name = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : 'Unknown User';
  const menuRef = useRef(null);
  const onClickProfileIcon = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  useEffect(() => {
    if (!isMenuVisible) return;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);

  if (!token) {
    return null;
  }

  return (
    <header>
      <FullLogo textColour="#FFFFFF" isClickable={!!user?.firstName} />

      {user?.firstName && token && (
        <div className="profile-icon" onClick={onClickProfileIcon}>
          <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} photoUrl={user.photo} />
        </div>
      )}

      {isMenuVisible && user && (
        <div className="user-panel" ref={menuRef}>
          <Card>
            <section className="post-details">
              <div className="profile-icon">
                <ProfileCircle fullName={name} photoUrl={user.photo} />
              </div>

              <div className="post-user-name">
                <p>{name}</p>
                <small>
                  {user?.cohort?.title
                    ? `${user.specialism}, ${user.cohort.title}`
                    : user.specialism}
                </small>
              </div>
            </section>

            <section className="user-panel-options border-top">
              <ul>
                <li>
                  <NavLink to={`/profile/${user.id}`}>
                    <ProfileIcon /> <p>Profile</p>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="#" onClick={onLogout}>
                    <LogoutIcon /> <p>Log out</p>
                  </NavLink>
                </li>
              </ul>
            </section>
          </Card>
        </div>
      )}
    </header>
  );
};

export default Header;
