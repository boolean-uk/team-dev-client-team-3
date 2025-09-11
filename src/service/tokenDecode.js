// npm i jwt-decode
import jwtDecode from 'jwt-decode';

/**
 * Decode a JWT and normalize common Microsoft WS-* claim URIs
 * to simpler OIDC-style names.
 *
 * @param {string} token - The JWT access/ID token string
 * @returns {{
 *   sub?: string,
 *   sid?: string,
 *   email?: string,
 *   name?: string,
 *   given_name?: string,
 *   family_name?: string,
 *   preferred_username?: string,
 *   roles?: string[],
 *   [key: string]: any
 * }}
 */
export function normalizeClaims(token) {
  if (!token) return {};

  const decoded = jwtDecode(token);

  // Helpers
  const first = (...keys) =>
    keys.find((k) => decoded[k] != null && decoded[k] !== '') &&
    decoded[keys.find((k) => decoded[k] != null && decoded[k] !== '')];
  const list = (...keys) => {
    const values = keys.flatMap((k) => {
      const v = decoded[k];
      if (Array.isArray(v)) return v;
      if (typeof v === 'string') return [v];
      return [];
    });
    // unique, keep order
    return Array.from(new Set(values));
  };

  // Common WS-* URIs
  const URI = {
    sid: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid',
    nameId: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
    name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
    givenName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
    surname: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
    upn: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn',
    role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  };

  // Build normalized object
  const claims = {
    // Stable subject/user id. Prefer 'sub'; fall back to WS-* nameidentifier or sid if that's what your STS issues.
    sub: first('sub', URI.nameId, URI.sid),

    // Session ID if present (Azure AD sometimes uses 'sid' as session id)
    sid: first('sid', URI.sid),

    email: first('email', URI.email),
    name: first('name', URI.name),
    given_name: first('given_name', URI.givenName),
    family_name: first('family_name', URI.surname),

    // login/UPN
    preferred_username: first('preferred_username', 'upn', URI.upn),

    // roles may appear as "role", "roles", or the WS-* role URI
    roles: list('role', 'roles', URI.role)
  };

  // Include all original claims too (optional) so nothing is lost
  return { ...decoded, ...claims };
}
