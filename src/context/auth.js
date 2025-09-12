import { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/header';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import useAuth from '../hooks/useAuth';
import { createProfile, login, register } from '../service/apiClient';
import { normalizeClaims } from '../service/tokenDecode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedToken && !token) {
      setToken(storedToken);
      navigate(location.state?.from?.pathname || '/');
    }
    if (storedUser) {
      setUser(storedUser);
    }
  }, [token, location.state?.from?.pathname, navigate]);

  const handleLogin = async (email, password) => {
    const res = await login(email, password);

    if (res.data === null) {
      return { status: res.status, message: res.message };
    }

    const { passwordHash, ...userData } = res.data.user;
    userData.id = normalizeClaims(res.data.token).sid;

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
    userData.id = normalizeClaims(res.data.token).sid;

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', res.data.token);

    setUser(userData);
    setToken(res.data.token);

    navigate('/verification');
  };

  // This works as a general PATCH now
  const handleCreateProfile = async (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    // Don't send id in body
    const { id, ...body } = updatedUserData;

    try {
      const res = await createProfile(updatedUserData.id, body);
      if (!res.ok) {
        console.error('Failed to created profile:', res.json());
        return;
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to created profile:', err);
    }
  };

  const value = {
    token,
    user,
    setUser,
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
