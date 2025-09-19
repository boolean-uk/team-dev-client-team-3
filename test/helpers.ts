// npm i jwt-decode
import { expect, type Page, type Response } from 'playwright/test';
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


const responseDescription = (response: Response): string =>
  `${response.status()} ${response.statusText()} (${response.url()})`;

export async function waitForResponseOk(
  page: Page,
  predicate: (response: Response) => boolean,
  description: string,
  trigger: () => Promise<void> = async () => {},
  timeout = 30_000
): Promise<Response> {
  const responsePromise = page.waitForResponse(predicate, { timeout });

  await trigger();

  let response: Response;
  try {
    response = await responsePromise;
  } catch (error) {
    throw new Error(`Timed out waiting for ${description}: ${(error as Error).message}`);
  }

  expect.soft(response.ok(), `${description} failed: ${responseDescription(response)}`).toBeTruthy();
  return response;
}

export async function resolveUserIdFromLocalStorage(page: Page): Promise<number> {
  const token = await page.evaluate(() => window.localStorage.getItem('token'));
  if (!token) {
    throw new Error('Token missing from localStorage after auth flow.');
  }

  const { sid, sub } = normalizeClaims(token);
  const rawId = sid ?? sub;

  if (!rawId) {
    throw new Error('Auth token did not contain a sid or sub claim.');
  }

  const id = Number(rawId);
  if (Number.isNaN(id)) {
    throw new Error(`Unable to parse user id from claim value: ${rawId}`);
  }

  return id;
}

export interface LoginThroughUiOptions {
  ensureLoggedOut?: boolean;
  expectNavigation?: string | RegExp;
  skipNavCheck?: boolean;
}

export async function loginThroughUI(
  page: Page,
  credentials: { email: string; password: string },
  options: LoginThroughUiOptions = {}
): Promise<void> {
  const { ensureLoggedOut = false, expectNavigation, skipNavCheck = false } = options;

  if (ensureLoggedOut) {
    await logoutIfLoggedIn(page);
  }

  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();

  const emailInput = page.getByLabel('Email *');
  const passwordInput = page.getByLabel('Password *');
  const submit = page.getByRole('button', { name: /log in/i });

  await emailInput.fill(credentials.email);
  await passwordInput.fill(credentials.password);

  await waitForResponseOk(
    page,
    (response) => response.url().includes('/login') && response.request().method() === 'POST',
    'login request',
    async () => {
      await submit.click();
    }
  );

  if (expectNavigation) {
    await page.waitForURL(expectNavigation, { timeout: 30_000 });
  } else {
    await expect(page).not.toHaveURL(/\/login(?:[?#]|$)/, { timeout: 30_000 });
  }

  if (!skipNavCheck) {
    await expect(page.locator('nav')).toBeVisible({ timeout: 30_000 });
  }
}

export async function logoutIfLoggedIn(page: Page): Promise<void> {
  const trigger = page.locator('header > .profile-icon').first();

  if ((await trigger.count()) === 0) {
    return;
  }

  try {
    await trigger.click();
    const logoutLink = page.getByRole('link', { name: /log out/i });
    await expect(logoutLink).toBeVisible({ timeout: 5_000 });
    await logoutLink.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  } catch {
    // Fall back to clearing localStorage to avoid leaking auth across tests.
    await page.evaluate(() => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    });
  }
}

const usernameValidationUrl = (username: string) =>
  `/validation/username/?username=${encodeURIComponent(username)}`;

export async function registerThroughUI(
  page: Page,
  overrides: Partial<TestUserData> = {}
): Promise<TestUserData> {
  const user = getNewTestUser(overrides);

  await page.goto('/register');

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const signUpBtn = page.getByRole('button', { name: /sign up/i });

  await emailInput.fill(user.email);
  await passwordInput.fill(user.password);

  await expect(emailInput).toHaveValue(user.email);
  await expect(passwordInput).toHaveValue(user.password);
  await expect(page.locator('ul.password-hint-3 li.valid')).toHaveCount(4);
  await expect(signUpBtn).toBeVisible();

  const emailValidationPromise = waitForResponseOk(
    page,
    (response) => {
      const url = response.url();
      return (
        url.includes(`/validation/email/${user.email}`) ||
        url.includes(`/validation/email/${encodeURIComponent(user.email)}`)
      );
    },
    'email validation during registration'
  );
  const passwordValidationPromise = waitForResponseOk(
    page,
    (response) =>
      response.url().includes('/validation/password') && response.request().method() === 'POST',
    'password validation during registration'
  );
  const registerPromise = waitForResponseOk(
    page,
    (response) => response.url().endsWith('/users') && response.request().method() === 'POST',
    'user registration request'
  );
  const loginAfterRegisterPromise = waitForResponseOk(
    page,
    (response) => response.url().includes('/login') && response.request().method() === 'POST',
    'auto-login after registration'
  );

  await signUpBtn.click();
  await Promise.all([
    emailValidationPromise,
    passwordValidationPromise,
    registerPromise,
    loginAfterRegisterPromise
  ]);

  const welcomeHeading = page.locator('h1.h3');
  await expect(welcomeHeading).toHaveText('Welcome to Cohort Manager', { timeout: 30_000 });

  const continueButton = page.getByRole('button', { name: 'Continue' });
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  await expect(page.locator('form.welcome-form')).toBeVisible();
  await expect(page.locator('.welcome-formheader h3')).toHaveText('Basic info');

  const firstNameInput = page.locator('input[name="firstName"]');
  const lastNameInput = page.locator('input[name="lastName"]');
  const usernameInput = page.locator('input[name="username"]');
  const githubInput = page.locator('input[name="githubUsername"]');

  await firstNameInput.fill(user.firstName);
  await lastNameInput.fill(user.lastName);
  await usernameInput.fill(user.username);
  await githubInput.fill(user.githubUsername);

  const usernameAvailabilityPromise = waitForResponseOk(
    page,
    (response) => response.url().includes(usernameValidationUrl(user.username)),
    'username availability check',
    async () => {},
    15_000
  ).catch(() => null);
  const githubAvailabilityPromise = waitForResponseOk(
    page,
    (response) => response.url().includes(usernameValidationUrl(user.githubUsername)),
    'github username availability check',
    async () => {},
    15_000
  ).catch(() => null);

  await usernameInput.blur();
  await githubInput.blur();
  await Promise.all([usernameAvailabilityPromise, githubAvailabilityPromise]);

  const nextBtn = page.getByRole('button', { name: 'Next' });
  await expect(nextBtn).toBeEnabled({ timeout: 30_000 });
  await nextBtn.click();

  await expect(page.locator('.welcome-formheader h3')).toHaveText('Contact info');

  const contactEmailInput = page.locator('input[name="email"]');
  await expect(contactEmailInput).toHaveValue(user.email);
  await expect(contactEmailInput).toBeDisabled();

  const mobileInput = page.locator('input[name="mobile"]');
  await mobileInput.fill(user.mobile);

  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.locator('.welcome-formheader h3')).toHaveText('About');

  const specialismInput = page.locator('input[name="specialism"]');
  const bioTextarea = page.locator('textarea[name="bio"]');

  await specialismInput.fill(user.specialism);
  await bioTextarea.fill(user.bio);

  const submitButton = page.getByRole('button', { name: 'Submit' });
  await expect(submitButton).toBeVisible();

  const profilePatchPromise = waitForResponseOk(
    page,
    (response) => response.url().includes('/users/') && response.request().method() === 'PATCH',
    'profile creation request'
  );

  await submitButton.click();
  await profilePatchPromise;

  const createPost = page.locator('.create-post-input');
  await expect(createPost).toBeVisible();
  await expect(createPost.locator('.profile-circle')).toBeVisible();
  await expect(createPost.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

  user.id = await resolveUserIdFromLocalStorage(page);
  return user;
}



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
