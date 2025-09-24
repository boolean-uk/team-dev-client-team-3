import { useState } from 'react';
import Button from '../../components/button';
import TextInput from '../../components/form/textInput';
import useAuth from '../../hooks/useAuth';
import CredentialsCard from '../../components/credentials';
import './register.css';

import {
  isValidEmailFormat,
  valPassword,
  valEightChars,
  valCapLetter,
  valNumber,
  valSpecialChar,
  validatePasswordServer,
  validateEmailServer
} from './registrationValidation';

const Register = () => {
  const { onRegister } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      setIsEmailValid(isValidEmailFormat(value));
    }
  };

  const onSubmit = async () => {
    if (valPassword(formData.password)) {
      const isEmailOk = await validateEmailServer(formData.email);
      const isPassOk = await validatePasswordServer(formData.password);

      if (isEmailOk && isPassOk) {
        onRegister(formData.email, formData.password);
      }
    }
  };

  return (
    <div className="bg-blue register credentialpage">
      <CredentialsCard
        title="Register"
        socialLinksTitle="Or sign up with"
        altButtonTitle="Already a user?"
        altButtonLink="/login"
        altButtonText="Log in"
      >
        <div className="register-form">
          <form>
            <TextInput
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              name="email"
              label={'Email *'}
              className={!isEmailValid ? 'emailinvalid' : ''}
              required
            />
            <TextInput
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              label={'Password *'}
              type={'password'}
            />
            <div className="password-hint">
              Password must contain at least: <br />
              <ul className="password-hint-3">
                <li className={valEightChars(formData.password) ? 'valid' : 'invalid'}>
                  - eight characters
                </li>
                <li className={valCapLetter(formData.password) ? 'valid' : 'invalid'}>
                  - one capital letter
                </li>
                <li className={valNumber(formData.password) ? 'valid' : 'invalid'}>- one number</li>
                <li className={valSpecialChar(formData.password) ? 'valid' : 'invalid'}>
                  - one special character
                </li>
              </ul>
            </div>
            <p className="password-hint-2">*Required</p>
          </form>
          <Button text="Sign up" onClick={() => onSubmit()} classes="green width-full" />
        </div>
      </CredentialsCard>
    </div>
  );
};

export default Register;
