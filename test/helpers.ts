// npm i jwt-decode
import jwtDecode from 'jwt-decode';

export interface TestUserData {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  githubUsername: string;
  mobile: string;
  role: number;
  specialism: string;
  cohort: string;
  startDate: Date;
  endDate: Date;
  bio: string;
}

type RawClaims = Record<string, unknown>;

export type NormalizedClaims = RawClaims & {
  sub?: string;
  sid?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  roles?: string[];
};

export const getNewTestUser = (overrides: Partial<TestUserData> = {}): TestUserData => {
  const saltSeed = Date.now() + Math.floor(Math.random() * 1_000);

  // number of milliseconds in one day
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const startDate = overrides.startDate ?? new Date(saltSeed + 7 * ONE_DAY); // 7 days in the future
  const endDate = overrides.endDate ?? new Date(saltSeed + 14 * ONE_DAY); // 14 days in the future

  const salt = overrides.username ?? `test-user-${saltSeed}`;

  return {
    email: overrides.email ?? `test_email_${saltSeed}@example.com`,
    password: overrides.password ?? 'SuperHash!4',
    firstName: overrides.firstName ?? 'Test',
    lastName: overrides.lastName ?? 'Tester',
    username: overrides.username ?? salt,
    githubUsername: overrides.githubUsername ?? `gh-user-${saltSeed}`,
    mobile: overrides.mobile ?? '+4712345678',
    role: overrides.role ?? 0,
    specialism: overrides.specialism ?? `Test-developer ${saltSeed}`,
    cohort: overrides.cohort ?? 'Cohort 1',
    startDate,
    endDate,
    bio: overrides.bio ?? `Test-developer bio with salt: ${saltSeed}`
  };
};



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
export function normalizeClaims(token: string | null | undefined): NormalizedClaims {
  if (!token) return {};

  const decoded = jwtDecode<RawClaims>(token);

  // Helpers
  const first = (...keys: string[]): string | undefined => {
    for (const key of keys) {
      const value = decoded[key];
      if (typeof value === 'string' && value.trim() !== '') {
        return value;
      }
    }
    return undefined;
  };

  const list = (...keys: string[]): string[] => {
    const values: string[] = [];
    for (const key of keys) {
      const v = decoded[key];
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === 'string' && item.trim() !== '') {
            values.push(item);
          }
        }
      } else if (typeof v === 'string' && v.trim() !== '') {
        values.push(v);
      }
    }
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
  const claims: NormalizedClaims = {
    ...decoded,
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

  // Preserve original claims while returning normalized aliases
  return claims;
}
