import { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from '../components/header';
import Modal from '../components/modal';
import Navigation from '../components/navigation';
import useAuth from '../hooks/useAuth';
import { patchProfile, login, register, getUserById } from '../service/apiClient';
import { normalizeClaims } from '../service/tokenDecode';
import Loader from '../components/loader/Loader';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      setToken(storedToken);
    }
    if (!storedToken && !token && location.pathname !== '/register') {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    if (user) {
      setIsAuthLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const reloadUser = async (id) => {
      try {
        const response = await getUserById(id);
        if (!response.ok) throw new Error('Failed to fetch user');

        const json = await response.json();
        const userData = json.data;
        userData.id = id;
        console.log('Reloaded user:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error reloading user:', error);
      }
    };

    if (token && !user) {
      const claims = normalizeClaims(token);
      const userId = claims?.sid;

      if (userId) {
        reloadUser(userId);
      } else {
        console.warn('Invalid token: could not extract user ID');
      }
    }
  }, [token, user]);

  useEffect(() => {
    if (token && user && location.pathname === '/login') {
      navigate(location.state?.from?.pathname || '/');
    }
  }, [token, user, location.pathname, location.state?.from?.pathname, navigate]);

  const handleLogin = async (email, password) => {
    const res = await login(email, password);
    console.log('Login response:', res);
    if (res.data === null) {
      return { status: res.status, message: res.message };
    }

    const { passwordHash, ...userData } = res.data.user;
    userData.id = normalizeClaims(res.data.token).sid;

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
    setToken(null);
    setUser(null);
  };

  const handleRegister = async (email, password) => {
    const res = await register(email, password);
    const { passwordHash, ...userData } = res.data.user;
    userData.id = normalizeClaims(res.data.token).sid;

    localStorage.setItem('token', res.data.token);

    setUser(userData);
    setToken(res.data.token);

    navigate('/verification');
  };

  const handleCreateProfile = async (updatedUserData) => {
    setUser(updatedUserData);
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
    isAuthLoading,
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
  const { token, user, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    console.log('Auth loading...');
    return <Loader isLoading={isAuthLoading} />;
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const profileIncomplete = user && !user.firstName;

  if (profileIncomplete && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
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
