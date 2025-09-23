import { expect, Page } from 'playwright/test';
import { normalizeClaims } from "../src/service/tokenDecode";

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

export async function logoutIfLoggedIn(page: Page): Promise<void> {
  const trigger = page.locator('header > .profile-icon').first();

  if ((await trigger.count()) === 0) {
    return;
  }

  try {
    await trigger.click();

    const logoutLink = page.getByRole('link', { name: /log out/i });
    expect(logoutLink).toBeVisible();
    await logoutLink.click();

    await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
    expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  } catch {
    // Fall back to clearing localStorage to avoid leaking auth across tests.
    await page.evaluate(() => {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    });
  }
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

export async function login(page: Page, user: TestUserData) {
  await page.goto('/login');
  await page.getByLabel('Email *').fill(user.email);
  await page.getByLabel('Password *').fill(user.password);
  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL('/');
  if (user.role === 1) {
    await expect(page.getByRole('heading', { name: /cohorts/i })).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: /my cohort/i })).toBeVisible();
  }


  // Navigation items exist with correct labels and hrefs
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  const home = nav.getByRole('link', { name: 'Home' });
  await expect(home).toHaveAttribute('href', '/');
  await expect(home).toHaveAttribute('aria-current', 'page');

  const profile = nav.getByRole('link', { name: 'Profile' });
  await expect(profile).toHaveAttribute('href', `/profile/${user.id}`);

  const cohort = nav.getByRole('link', { name: 'Cohort' });
  await expect(cohort).toHaveAttribute('href', '/cohort');
}

export async function warmApi(page: Page) {
  const user = { email: 'oyvind.perez1@example.com', password: 'SuperHash!4', id: 1 };
  await page.goto('/login');
  await page.getByLabel('Email *').fill(user.email);
  await page.getByLabel('Password *').fill(user.password);
  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: /cohorts/i })).toBeVisible();

  // Navigation items exist with correct labels and hrefs
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  const home = nav.getByRole('link', { name: 'Home' });
  await expect(home).toHaveAttribute('href', '/');
  await expect(home).toHaveAttribute('aria-current', 'page');

  const profile = nav.getByRole('link', { name: 'Profile' });
  await expect(profile).toHaveAttribute('href', `/profile/${user.id}`);

  const cohort = nav.getByRole('link', { name: 'Cohort' });
  await expect(cohort).toHaveAttribute('href', '/cohort');
}

//Can't create teacher
//Keeps you logged in
export const signUpThroughUI = async (page: Page, overrides: Partial<TestUserData> = {}) => {
  const user = getNewTestUser(overrides);

  await page.goto('/register');
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await expect(page.locator('#email')).toHaveValue(user.email);
  await expect(page.locator('#password')).toHaveValue(user.password);
  await expect(page.locator('ul.password-hint-3 li.valid')).toHaveCount(4);
  const signUpBtn = page.getByRole('button', { name: /sign up/i });
  await expect(signUpBtn).toBeVisible();
  await signUpBtn.click();
  await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30000 });

  // Proceed to Create Profile stepper
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 1: Basic info
  await expect(page.locator('form.welcome-form')).toBeVisible();
  await expect(page.locator('.welcome-formheader h3')).toHaveText('Basic info');

  await page.locator('input[name="firstName"]').fill(user.firstName);
  await page.locator('input[name="lastName"]').fill(user.lastName);
  await page.locator('input[name="username"]').fill(user.username);
  await page.locator('input[name="githubUsername"]').fill(user.githubUsername);

  // Trigger server-side validation via blur
  await page.locator('input[name="githubUsername"]').blur();
  await page.locator('input[name="username"]').blur();

  const nextBtn = page.getByRole('button', { name: 'Next' });
  await expect(nextBtn).toBeEnabled({ timeout: 30000 });
  await nextBtn.click();

  // Step 2: Contact info
  await expect(page.locator('.welcome-formheader h3')).toHaveText('Contact info');

  await expect(page.locator('input[name="email"]')).toHaveValue(user.email);
  await expect(page.locator('input[name="email"]')).toBeDisabled();
  await page.locator('input[name="mobile"]').fill(user.mobile);

  await page.getByRole('button', { name: 'Next' }).click();

  // Step 3: About
  await expect(page.locator('.welcome-formheader h3')).toHaveText('About');

  await page.locator('input[name="specialism"]').fill(user.specialism);
  await page.locator('textarea[name="bio"]').fill(user.bio);

  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit' }).click();

  const createPost = page.locator('.create-post-input');
  await expect(createPost).toBeVisible();
  await expect(createPost.locator('.profile-circle')).toBeVisible();
  await expect(createPost.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

  // Grab id from localStorage for routing later
  const id = await resolveUserIdFromLocalStorage(page);
  if (!id) throw new Error('Could not resolve user id after registration');

  user.id = id;
  return user;
}

export async function expectProfileLoaded(page: Page) {
  expect(page.getByRole('heading', { name: 'Basic info' })).toBeVisible();
}

const toISO = (d: Date | string) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

