import { validateUsername } from '../../service/apiValidation';

export const validateUsernameServer = async (username) => {
  try {
    const res = await validateUsername(username);
    const body = await res.json();

    if (res.status === 400) {
      console.warn('Valid username (server-side):', body);
      return false;
    }

    if (!res.ok) {
      console.error(`Unexpected error ${res.status}:`, body);
      return false;
    }

    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.error('Network error validating username:', err);
    return false;
  }
};

export const validateUsernameClient = (username) => {
  // Rule 1: Check allowed characters only
  if (!/^[A-Za-z0-9-]+$/.test(username)) {
    return false;
  }

  // Rule 2: Cannot start or end with hyphen, and no consecutive hyphens
  if (/^-|-$/.test(username) || /--/.test(username)) {
    return false;
  }

  // Rule 3: Max length 39
  if (username.length > 39) {
    return false;
  }

  return true;
};
