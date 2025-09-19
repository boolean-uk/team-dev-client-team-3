import { test, expect, type Page } from 'playwright/test';
import {
  registerThroughUI,
  logoutIfLoggedIn,
  loginThroughUI,
  waitForResponseOk
} from './helpers';

// Helper, not a test. Checks that profile page gets loaded.
async function expectProfileLoaded(page: Page) {
  await expect(page).toHaveURL(/.*\/profile(?:\/\d+)?\/?$/); //This regex matches URLs like '/profile' optionally followed by a numeric user ID, and optionally ending with a trailing slash.
  await expect(page.getByRole('heading', { name: 'Basic info' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Contact info' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Bio' })).toBeVisible();
}

test('Student can see and edit own profile', async ({ page }) => {
  test.setTimeout(60_000);
  const student = await registerThroughUI(page);
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
  const saveButton = page.getByRole('button', { name: 'Save' });
  const updateResponse = waitForResponseOk(
    page,
    (response) =>
      response.url().includes(`/users/${student.id}`) && response.request().method() === 'PATCH',
    'student self-update'
  );
  await saveButton.click();
  await updateResponse;
  await page.waitForURL('**/');

  await logoutIfLoggedIn(page);
  await loginThroughUI(page, student, { ensureLoggedOut: true });

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
  test.setTimeout(60_000);
  const student = await registerThroughUI(page);

  // Login as student
  await logoutIfLoggedIn(page);
  await loginThroughUI(page, student, { ensureLoggedOut: true });

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
  test.setTimeout(60_000);
  // Create student
  const student = await registerThroughUI(page);
  await logoutIfLoggedIn(page);

  // Login as teacher and visit student page
  await loginThroughUI(page, { email: 'oyvind.perez1@example.com', password: 'SuperHash!4' }, { ensureLoggedOut: true });
  await page.goto(`/profile/${student.id}`);
  await expectProfileLoaded(page);
  await page.getByRole('button', { name: 'Edit' }).click();

  // Make changes and return to dashboard
  const updatedSpecialism = 'oyvind.perez1@example.com was here';
  const updatedBio = 'oyvind.perez1@example.com was here';
  await page.locator('input[name="specialism"]').fill(updatedSpecialism);
  await page.locator('textarea[name="bio"]').fill(updatedBio);
  const teacherSave = waitForResponseOk(
    page,
    (response) =>
      response.url().includes(`/users/${student.id}`) && response.request().method() === 'PATCH',
    'teacher profile update'
  );
  await page.getByRole('button', { name: 'Save' }).click();
  await teacherSave;
  await page.waitForURL('**/');
  await expect(page.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

  // Assert data is still there
  await page.goto(`/profile/${student.id}`);
  await expectProfileLoaded(page);
  await expect(page.locator('input[name="specialism"]')).toHaveValue(updatedSpecialism);
  await expect(page.locator('textarea[name="bio"]')).toHaveValue(updatedBio);
});
