import { useState } from 'react';
import Button from '../../components/button';
import TextInput from '../../components/form/textInput';
import useAuth from '../../hooks/useAuth';
import CredentialsCard from '../../components/credentials';
import './login.css';
import RememberMeCheckbox from '../../components/rememberMe/RememberMeCheckbox';

const Login = () => {
  const { onLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-blue login credentialpage">
      <CredentialsCard
        title="Login"
        socialLinksTitle="Or log in with"
        altButtonTitle="Need an account?"
        altButtonLink="/register"
        altButtonText="Sign up"
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
              <RememberMeCheckbox/>

              <a
                className="passwordActionBox"
                style={{ textAlign: 'right' }}
                href="https://youtu.be/dQw4w9WgXcQ"
              >
                Forgot password?
              </a>
            </div>
          </form>

          <Button
            text="Log in"
            type="submit"
            onClick={() => onLogin(formData.email, formData.password)}
            classes="green width-full"
          />
        </div>
      </CredentialsCard>
    </div>
  );
};

export default Login;
