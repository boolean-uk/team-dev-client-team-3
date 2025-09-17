import { NavLink } from 'react-router-dom';
import HomeIcon from '../../assets/icons/homeIcon';
import ProfileIcon from '../../assets/icons/profileIcon';
import CohortIcon from '../../assets/icons/cohortIcon';
import useAuth from '../../hooks/useAuth';
import './style.css';

const Navigation = () => {
  const { token, user } = useAuth();

  if (!token) return null;

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">
            {({ isActive }) => (
              <>
                <HomeIcon isActive={isActive} />
                <p>Home</p>
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to={`/profile/${user.id}`}>
            {({ isActive }) => (
              <>
                <ProfileIcon isActive={isActive} />
                <p>Profile</p>
              </>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink to="/cohort">
            {({ isActive }) => (
              <>
                <CohortIcon isActive={isActive} />
                <p>Cohort</p>
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
