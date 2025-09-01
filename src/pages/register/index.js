import { useState } from 'react';
import Button from '../../components/button';
import TextInput from '../../components/form/textInput';
import useAuth from '../../hooks/useAuth';
import CredentialsCard from '../../components/credentials';
import './register.css';

const Register = () => {
  const { onRegister } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isEmailValid, setIsEmailValid] = useState(true);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email') {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

      const valid = emailRegex.test(value);
      setIsEmailValid(valid);
    }
  };

  const validateEmail = () => {
    return '';
  };

  const validatePassword = () => {
    if (valEightChars() && valNumber() && ValCapLetter() && ValSpecialChar()) {
      // Replace with endpoint from backend for security.
      console.log('Valid password');
    } else {
      console.log('Invalid password');
    }
  };

  const valEightChars = () => {
    if (formData.password.length >= 8) {
      return true;
    }
    return false;
  };

  const ValCapLetter = () => {
    const uppercaseRegex = /[A-Z]/;
    if (uppercaseRegex.test(formData.password)) {
      return true;
    }
    return false;
  };

  const valNumber = () => {
    const numberRegex = /\d/;
    if (numberRegex.test(formData.password)) {
      return true;
    }
    return false;
  };

  const ValSpecialChar = () => {
    const specialCharRegex = /[!@#$%^&*()\-=+{};:',./\\|~]/;
    if (specialCharRegex.test(formData.password)) {
      return true;
    }
    return false;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateEmail() && validatePassword()) {
      onRegister(formData.email, formData.password);
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
              onChange={onChange}
              type="email"
              name="email"
              label={'Email *'}
              className={!isEmailValid ? 'emailinvalid' : ''}
              required
            />
            <TextInput
              value={formData.password}
              onChange={onChange}
              name="password"
              label={'Password *'}
              type={'password'}
            />
            {/* <p className="password-hint">
              Password must contain at least eight characters, including at least one capital
              letter, one number and one special character
            </p> */}
            <p className="password-hint">
              Password must contain at least: <br />
              <ul className="password-hint-3">
                <li className={valEightChars() ? 'valid' : 'invalid'}>- eight characters</li>
                <li className={ValCapLetter() ? 'valid' : 'invalid'}>- one capital letter</li>
                <li className={valNumber() ? 'valid' : 'invalid'}>- one number</li>
                <li className={ValSpecialChar() ? 'valid' : 'invalid'}>- one special character</li>
              </ul>
            </p>
            <p className="password-hint-2">*Required</p>
          </form>
          <Button
            text="Sign up"
            // onClick={() => onRegister(formData.email, formData.password)}
            onClick={() => console.log(validatePassword())}
            classes="green width-full"
          />
        </div>
      </CredentialsCard>
    </div>
  );
};

export default Register;
