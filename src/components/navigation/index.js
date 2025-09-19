import { NavLink } from 'react-router-dom';
import HomeIcon from '../../assets/icons/homeIcon';
import ProfileIcon from '../../assets/icons/profileIcon';
import CohortIcon from '../../assets/icons/cohortIcon';
import useAuth from '../../hooks/useAuth';
import './style.css';

const Navigation = () => {
  const { token, user } = useAuth();
  if (!token) return null;

  // Restricts user from changing page if profile is incomplete
  const profileIncomplete = !user?.firstName;

  const renderLink = (to, Icon, label, isDisabled = false) => {
    return (
      <NavLink
        to={isDisabled ? '#' : to}
        onClick={(e) => {
          if (isDisabled) e.preventDefault();
        }}
        className={isDisabled ? 'disabled-link' : undefined}
      >
        {({ isActive }) => (
          <>
            <Icon isActive={isActive && !isDisabled} />
            <p>{label}</p>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <nav>
      <ul>
        <li>{renderLink('/', HomeIcon, 'Home', profileIncomplete)}</li>
        <li>{renderLink(`/profile/${user.id}`, ProfileIcon, 'Profile', profileIncomplete)}</li>
        <li>{renderLink('/cohort', CohortIcon, 'Cohort', profileIncomplete)}</li>
      </ul>
    </nav>
  );
};

export default Navigation;
