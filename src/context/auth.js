import { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/header';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import useAuth from '../hooks/useAuth';
import { patchProfile, login, register } from '../service/apiClient';
import { normalizeClaims } from '../service/tokenDecode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserRaw = localStorage.getItem('user');

    if (storedToken && !token) {
      setToken(storedToken);
    }

    if (storedUserRaw && !user) {
      try {
        const parsed = JSON.parse(storedUserRaw);
        if (parsed) setUser(parsed);
      } catch {
        console.err('Local storage user is corrupt!', storedUserRaw);
      }
    }

    // If authenticated and on the login page, navigate back to the intended page or root.
    if (token && location.pathname === '/login') {
      navigate(location.state?.from?.pathname || '/');
    }
  }, [token, user, location.pathname, location.state?.from?.pathname, navigate]);

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

  const handleCreateProfile = async (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    // Don't send id in body
    const { id, ...body } = updatedUserData;

    try {
      const res = await patchProfile(updatedUserData.id, body);
      if (!res.ok) {
        console.error('Failed to created profile:', res.json());
        return;
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to created profile:', err);
    }
  };

  const handlePatchProfile = async (updatedUserData) => {
    const { id, ...body } = updatedUserData;

    try {
      const res = await patchProfile(updatedUserData.id, body);
      if (!res.ok) {
        console.error('Failed to Patch profile:', res.json());
        return;
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to Patch profile:', err);
    }
  };

  const value = {
    token,
    user,
    setUser,
    onLogin: handleLogin,
    onLogout: handleLogout,
    onRegister: handleRegister,
    onCreateProfile: handleCreateProfile,
    onPatchProfile: handlePatchProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const ProtectedRoute = ({ children, checkUser }) => {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to={'/login'} replace state={{ from: location }} />;
  }

  if (checkUser && user.firstName !== '') {
    console.log("User is already registered, redirecting to '/'");
    return <Navigate to={'/'} />;
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
