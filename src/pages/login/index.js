import { useEffect, useState } from 'react';
import Button from '../../components/button';
import TextInput from '../../components/form/textInput';
import useAuth from '../../hooks/useAuth';
import CredentialsCard from '../../components/credentials';
import './login.css';
import RememberMeCheckbox from '../../components/rememberMe/RememberMeCheckbox';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/loader/Loader';

const Login = () => {
  const { onLogin, isTokenExpiredOrInvalid } = useAuth();
  const [onLoginError, setOnLoginError] = useState({});
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onChange = (e) => {
    setOnLoginError({});
    const { name, value } = e.target;
    if (name === 'rememberMe') {
      setFormData({ ...formData, rememberMe: e.target.checked });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    setIsLoading(true);
    const results = await onLogin(formData.email, formData.password, formData.rememberMe);
    setOnLoginError(results);
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        if (isTokenExpiredOrInvalid(token)) {
          console.log('Token is invalid or expired. User needs to log in.');
          return;
        }
        navigate('/');
      } catch (error) {
        console.error('Error during auto-login:', error);
      }
    } else {
      console.log('No token found in localStorage. User needs to log in.');
    }
  }, []);

  return (
    <div className="bg-blue login credentialpage">
      <CredentialsCard
        title="Login"
        socialLinksTitle="Or log in with"
        altButtonTitle="Need an account?"
        altButtonLink="/register"
        altButtonText="Sign up"
        error={onLoginError.message}
      >
        <div className="login-form">
          <form>
            <TextInput value={formData.email} onChange={onChange} name="email" label={'Email *'} />

            <TextInput
              value={formData.password}
              onChange={onChange}
              name="password"
              label={'Password *'}
              type={'password'}
            />

            <div className="passwordActionContainer">
              <RememberMeCheckbox checked={formData.rememberMe} onChange={onChange} />

              {/* <a
                className="passwordActionBox"
                style={{ textAlign: 'right' }}
                href="https://youtu.be/dQw4w9WgXcQ"
              >
                Forgot password?
              </a> */}
            </div>
          </form>
          {isLoading ? (
            <Button text={<Loader />} type="submit" classes="green width-full" disabled={true} />
          ) : (
            <Button text="Log in" type="submit" onClick={handleLogin} classes="green width-full" />
          )}
        </div>
      </CredentialsCard>
    </div>
  );
};

export default Login;
