import { validateEmail, validatePassword } from '../../service/apiValidation';

/* CLIENT-SIDE VALIDATION HELPERS */
// Client-side email
export const isValidEmailFormat = (email) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// Client-side password
export const valEightChars = (password) => password.length >= 8;

export const valCapLetter = (password) => /[A-Z]/.test(password);

export const valNumber = (password) => /\d/.test(password);

export const valSpecialChar = (password) => /[!@#$%^&*()\-=+{};:',./\\|~]/.test(password);

export const valPassword = (password) => {
  const valid =
    valEightChars(password) &&
    valNumber(password) &&
    valCapLetter(password) &&
    valSpecialChar(password);

  console.log('Valid password (client-side):', valid);
  return valid;
};

/* SERVER-SIDE VALIDATION HELPERS */
// Server-side email
export const validateEmailServer = async (email) => {
  const validationResult = { result: false, message: null };
  try {
    const res = await validateEmail(email);
    const body = await res.json();

    if (res.status === 400) {
      console.warn('Valid email (server-side):', body);
      validationResult.result = false;
      validationResult.message = body.message;
    }

    if (!res.ok) {
      console.error(`Unexpected error ${res.status}:`, body);
      validationResult.result = false;
      validationResult.message = body.message;
    }

    if (res.ok) {
      console.log('Valid email (server-side):', body);
      validationResult.result = true;
      validationResult.message = body.message;
    }
  } catch (err) {
    console.error('Network error validating email:', err);
    validationResult.result = false;
    validationResult.message = 'Network error';
  }
  return validationResult;
};

// Server-side password
export const validatePasswordServer = async (password) => {
  try {
    const res = await validatePassword(password);
    const body = await res.json();

    if (res.status === 400) {
      console.warn('Valid password (server-side):', body);
      return false;
    }

    if (!res.ok) {
      console.error(`Unexpected error ${res.status}:`, body);
      return false;
    }

    if (res.ok) {
      console.log('Valid password (server-side):', body);
      return true;
    }
  } catch (err) {
    console.error('Network error validating password:', err);
    return false;
  }
};
