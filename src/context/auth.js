import { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/header';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import useAuth from '../hooks/useAuth';
import { createProfile, login, register } from '../service/apiClient';

// eslint-disable-next-line camelcase
// import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({
    bio: 'Dette er bioen min',
    email: 'jonnabr@hotmail.com',
    endDate: '',
    firstName: 'Jonatan',
    githubUrl: '',
    id: -1,
    lastName: 'Berg',
    mobile: '93277670',
    photo: '',
    role: 0,
    specialism: '',
    startDate: '',
    username: 'Jonnashell'
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedToken && !token) {
      setToken(storedToken);
      navigate(location.state?.from?.pathname || '/');
    }
    if (storedUser && !user) {
      setUser(storedUser);
    }
  }, [token, location.state?.from?.pathname, navigate]);

  const handleLogin = async (email, password) => {
    const res = await login(email, password);

    if (!res.data.token) {
      return navigate('/login');
    }

    const { passwordHash, ...userData } = res.data.user;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', res.data.token);

    setUser(userData);
    setToken(res.data.token);

    if (userData.firstName === '') {
      console.log('Redirecting to welcome page');
      navigate('/welcome');
    } else {
      navigate(location.state?.from?.pathname || '/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const handleRegister = async (email, password) => {
    const res = await register(email, password);
    const { passwordHash, ...userData } = res.data.user;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', res.data.token);

    setUser(userData);
    setToken(res.data.token);

    navigate('/verification');
  };

  const handleCreateProfile = async (firstName, lastName, githubUrl, bio) => {
    const updatedUser = {
      ...user,
      firstName,
      lastName,
      githubUrl,
      bio
    };
    setUser(updatedUser);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    await createProfile(updatedUser.id, firstName, lastName, githubUrl, bio);
    navigate('/');
  };

  const value = {
    token,
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
    onCreateProfile: handleCreateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={'/login'} replace state={{ from: location }} />;
  }

  return (
    <div className="container">
      <Header />
      <Navigation />
      <Modal />
      {children}
    </div>
  );
};

export { AuthContext, AuthProvider, ProtectedRoute };
