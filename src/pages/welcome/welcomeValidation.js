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

export const mobileRegex = new RegExp(
  '^\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|' +
    '2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|' +
    '4[987654310]|3[9643210]|2[70]|7|1)\\d{1,14}$'
);
