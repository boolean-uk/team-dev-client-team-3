import { test, expect, Page } from 'playwright/test';
import { getNewTestUser, normalizeClaims, TestUserData } from './helpers';


// Helper, not a test. Signs up a user and returns it.
async function signUpThroughUI(page: Page, overrides: Partial<TestUserData> = {}) {
  const user = getNewTestUser(overrides);

  // Registration before stepper
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

  // Proceed to profile creation wizard
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

  // Landed on feed
  await expect(page.locator('.create-post-input')).toBeVisible();

  // Grab id from localStorage for routing later
  const token = await page.evaluate(() => window.localStorage.getItem('token'));
  const id = token ? normalizeClaims(token).sid : null;

  if (!id) {
    throw new Error('Could not resolve user id after registration');
  }

  user.id = Number(id);
  return user;
};

// Helper, not a test. Logs user out.
async function logoutIfLoggedIn(page: Page) {
  const trigger = page.locator('header > .profile-icon').first();

  if (!(await trigger.count())) {
    return;
  }

  try {
    await trigger.click();
    const link = page.getByRole('link', { name: /log out/i });
    await expect(link).toBeVisible({ timeout: 5_000 });
    await link.click();
    await expect(page).toHaveURL(/\/login/);
  } catch {
    /* noop */
  }
}

// Helper, not a test. Checks that profile page gets loaded.
async function expectProfileLoaded(page: Page) {
  await expect(page).toHaveURL(/.*\/profile(?:\/\d+)?\/?$/); //This regex matches URLs like '/profile' optionally followed by a numeric user ID, and optionally ending with a trailing slash.
  await expect(page.getByRole('heading', { name: 'Basic info' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact info' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bio' })).toBeVisible();
}

// Helper, not a test. Logs in a user and waits for '/' to load
async function login(page: Page, user: { email: string, password: string }) {
  await page.goto('/login');
  await page.locator('input[name="email"]').fill(user.email);
  await page.locator('input[name="password"]').fill(user.password);
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL('**/');
  await expect(page.locator('nav')).toBeVisible();
}

test('Student can see and edit own profile', async ({ page }) => {
  const student = await signUpThroughUI(page);
  await page.goto(`/profile/${student.id}`);
  await expectProfileLoaded(page);

  // Check that everything is disabled
  await expect(page.locator('input[name="firstName"]')).toBeDisabled();
  await expect(page.locator('input[name="lastName"]')).toBeDisabled();
  await expect(page.locator('input[name="username"]')).toBeDisabled();
  await expect(page.locator('input[name="githubUsername"]')).toBeDisabled();

  await expect(page.locator('input[name="email"]')).toBeDisabled();
  await expect(page.locator('input[name="mobile"]')).toBeDisabled();
  await expect(page.locator('input[name="password"]')).toBeDisabled();

  await expect(page.locator('input[name="specialism"]')).toBeDisabled();
  await expect(page.locator('input[name="cohort"]')).toBeDisabled();
  await expect(page.locator('input[name="startDate"]')).toBeDisabled();
  await expect(page.locator('input[name="endDate"]')).toBeDisabled();

  await expect(page.locator('textarea[name="bio"]')).toBeDisabled();

  // Check that correct fields get enabled for a student editing their own profile
  await page.getByRole('button', { name: 'Edit' }).click();

  await expect(page.locator('input[name="firstName"]')).toBeEditable();
  await expect(page.locator('input[name="lastName"]')).toBeEditable();
  await expect(page.locator('input[name="username"]')).toBeDisabled();
  await expect(page.locator('input[name="githubUsername"]')).toBeDisabled();

  await expect(page.locator('input[name="email"]')).toBeEditable();
  await expect(page.locator('input[name="mobile"]')).toBeEditable();
  await expect(page.locator('input[name="password"]')).toBeEditable();

  await expect(page.locator('input[name="specialism"]')).toBeDisabled();
  await expect(page.locator('input[name="cohort"]')).toBeDisabled();
  await expect(page.locator('input[name="startDate"]')).toBeDisabled();
  await expect(page.locator('input[name="endDate"]')).toBeDisabled();

  await expect(page.locator('textarea[name="bio"]')).toBeEditable();

  // Create edits
  const newFirst = `${student.firstName} [Updated]`;
  const newLast = `${student.lastName} [Updated]`;
  const newMobile = `${student.mobile} [Updated]`;
  const newEmail = `${student.email}.update`;
  const newBio = `${student.bio} [Updated]`;;
  // const newPassword = `${student.firstName} [Updated]`; // Not implemented in backend

  await page.locator('input[name="firstName"]').fill(newFirst);
  await page.locator('input[name="lastName"]').fill(newLast);
  await page.locator('input[name="email"]').fill(newEmail);
  await page.locator('input[name="mobile"]').fill(newMobile);
  await page.locator('textarea[name="bio"]').fill(newBio);

  // Log out and log in.
  student.email = newEmail;
  await page.getByRole('button', { name: 'Save' }).click();
  await logoutIfLoggedIn(page)
  await login(page, student)

  // Check that data got saved
  await page.goto(`/profile/${student.id}`);
  await expectProfileLoaded(page);

  await expect(page.locator('input[name="firstName"]')).toHaveValue(newFirst);
  await expect(page.locator('input[name="lastName"]')).toHaveValue(newLast);
  await expect(page.locator('input[name="email"]')).toHaveValue(newEmail);
  await expect(page.locator('input[name="mobile"]')).toHaveValue(newMobile);
  await expect(page.locator('textarea[name="bio"]')).toHaveValue(newBio);
});

test('Student views a teacher profile as read-only (no password field, no edit button)', async ({ page }) => {
  const student = await signUpThroughUI(page);

  // Login as student
  await logoutIfLoggedIn(page);
  await login(page, student);

  // Visit teacher 
  await page.goto(`/profile/${1}`); // Oyvind Perez
  await expectProfileLoaded(page);

  // Check data
  await expect(page.getByRole('heading', { name: 'Professional info' })).toBeVisible();

  await expect(page.locator('input[name="firstName"]')).toBeDisabled();
  await expect(page.locator('input[name="email"]')).toBeDisabled();
  await expect(page.locator('input[name="mobile"]')).toBeDisabled();
  await expect(page.locator('textarea[name="bio"]')).toBeDisabled();

  await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
  await expect(page.locator('input[name="password"]')).toHaveCount(0);
});

test('Teacher can edit a student profile and persist changes', async ({ page }) => {
  // Create student
  const student = await signUpThroughUI(page);
  await logoutIfLoggedIn(page)

  // Login as teacher and visit student page
  await login(page, { email: "oyvind.perez1@example.com", password: "SuperHash!4" });
  await page.goto(`/profile/${student.id}`);
  await expectProfileLoaded(page);
  await page.getByRole('button', { name: 'Edit' }).click();

  // Make changes and return to dashboard
  const updatedSpecialism = 'oyvind.perez1@example.com was here';
  const updatedBio = 'oyvind.perez1@example.com was here';
  await page.locator('input[name="specialism"]').fill(updatedSpecialism);
  await page.locator('textarea[name="bio"]').fill(updatedBio);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForURL('**/');
  await expect(page.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

  // Assert data is still there
  await page.goto(`/profile/${student.id}`);
  await expectProfileLoaded(page);
  await expect(page.locator('input[name="specialism"]')).toHaveValue(updatedSpecialism);
  await expect(page.locator('textarea[name="bio"]')).toHaveValue(updatedBio);
});