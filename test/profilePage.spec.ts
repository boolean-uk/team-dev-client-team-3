// import { test, expect, Page } from 'playwright/test';
// import { getNewTestUser, TestUserData } from './helpers';

// const toISO = (d: Date | string) =>
//   (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);

// async function signUpThroughUI(page: Page, overrides: Partial<TestUserData> = {}) {
//   const user = getNewTestUser(overrides);

//   await page.goto('/register');
//   await page.locator('input[name="email"]').fill(user.email);
//   await page.locator('input[name="password"]').fill(user.password);
//   await page.getByRole('button', { name: /sign up/i }).click();

//   await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30_000 });
//   await page.getByRole('button', { name: 'Continue' }).click();

//   // Step 1
//   await expect(page.locator('form.welcome-form')).toBeVisible();
//   await page.locator('input[name="firstName"]').fill(user.firstName);
//   await page.locator('input[name="lastName"]').fill(user.lastName);
//   await page.locator('input[name="username"]').fill(user.username);
//   await page.locator('input[name="githubUsername"]').fill(user.githubUsername);
//   await page.locator('input[name="githubUsername"]').blur();
//   await page.locator('input[name="username"]').blur();
//   await page.getByRole('button', { name: 'Next' }).click();

//   // Step 2
//   await expect(page.locator('input[name="email"]')).toHaveValue(user.email);
//   await page.locator('input[name="mobile"]').fill(user.mobile);
//   await page.getByRole('button', { name: 'Next' }).click();

//   // Step 3
//   await page.locator('input[name="role"]').fill(String(user.role));
//   await page.locator('input[name="specialism"]').fill(user.specialism);
//   await page.locator('input[name="cohort"]').fill(user.cohort);
//   await page.locator('input[name="startDate"]').fill(toISO(user.startDate));
//   await page.locator('input[name="endDate"]').fill(toISO(user.endDate));
//   await page.getByRole('button', { name: 'Next' }).click();

//   // Step 4
//   await page.locator('textarea[name="bio"]').fill(user.bio);
//   await page.getByRole('button', { name: 'Submit' }).click();

//   // Landed on feed
//   await expect(page.locator('.create-post-input')).toBeVisible();

//   // Grab id from localStorage for routing later
//   const id = await page.evaluate(() => {
//     const raw = window.localStorage.getItem('user');
//     return raw ? JSON.parse(raw).id : null;
//   });
//   if (!id) throw new Error('Could not resolve user id after registration');

//   user.id = id;
//   return user;
// }

// async function logoutIfLoggedIn(page: Page) {
//   const trigger = page.locator('header > .profile-icon').first();
//   if (!(await trigger.count())) return;
//   try {
//     await trigger.click();
//     const link = page.getByRole('link', { name: /log out/i });
//     await expect(link).toBeVisible({ timeout: 5_000 });
//     await link.click();
//     await expect(page).toHaveURL(/\/login/);
//   } catch {
//     /* noop */
//   }
// }

// async function login(page: Page, user: TestUserData) {
//   await page.goto('/login');
//   await page.locator('input[name="email"]').fill(user.email);
//   await page.locator('input[name="password"]').fill(user.password);
//   await page.getByRole('button', { name: /log in/i }).click();

//   await page.waitForURL('**/');
//   await expect(page.locator('nav')).toBeVisible();
// }

// async function expectProfileLoaded(page: Page) {
//   await expect(page.getByRole('heading', { name: 'Basic info' })).toBeVisible();
// }

// test.describe.serial('Profile Page General tests', () => {
//   let student: TestUserData;
//   let teacher: TestUserData;

//   test.beforeAll(async ({ browser }) => {
//     const ctx = await browser.newContext();
//     const page = await ctx.newPage();

//     student = await signUpThroughUI(page);
//     await logoutIfLoggedIn(page);

//     teacher = await signUpThroughUI(page, {
//       role: 1,
//       firstName: 'Teacher',
//       lastName: 'User',
//       specialism: 'Coaching',
//       cohort: 'Mentors',
//       bio: 'Teacher bio ready for editing tests.'
//     });
//     await logoutIfLoggedIn(page);

//     await ctx.close();
//   });

//   test.afterEach(async ({ page }) => {
//     await logoutIfLoggedIn(page);
//   });

//   test('Student can edit own profile and sees saved values', async ({ page }) => {
//     await login(page, student);

//     await page.goto(`/profile/${student.id}`);
//     await expectProfileLoaded(page);

//     await expect(page.locator('input[name="firstName"]')).toBeDisabled();
//     await page.getByRole('button', { name: 'Edit' }).click();

//     const newFirst = `${student.firstName} Updated`;
//     const newBio = 'Updated profile bio text for validation.';

//     await page.locator('input[name="firstName"]').fill(newFirst);
//     await page.locator('textarea[name="bio"]').fill(newBio);

//     await page.getByRole('button', { name: 'Save' }).click();
//     await page.waitForURL('**/');
//     await expect(page.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

//     await page.goto(`/profile/${student.id}`);
//     await expectProfileLoaded(page);
//     await expect(page.locator('input[name="firstName"]')).toHaveValue(newFirst);
//     await expect(page.locator('textarea[name="bio"]')).toHaveValue(newBio);
//   });

//   test('Student views a teacher profile as read-only (no password field)', async ({ page }) => {
//     await login(page, student);

//     await page.goto(`/profile/${teacher.id}`);
//     await expectProfileLoaded(page);

//     await expect(page.getByRole('heading', { name: 'Professional info' })).toBeVisible();

//     await expect(page.locator('input[name="firstName"]')).toBeDisabled();
//     await expect(page.locator('input[name="email"]')).toBeDisabled();
//     await expect(page.locator('input[name="mobile"]')).toBeDisabled();
//     await expect(page.locator('textarea[name="bio"]')).toBeDisabled();

//     await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
//     await expect(page.locator('input[name="password"]')).toHaveCount(0);
//   });

//   test('Teacher can edit a student profile and persist changes', async ({ page }) => {
//     await login(page, teacher);

//     await page.goto(`/profile/${student.id}`);
//     await expectProfileLoaded(page);

//     await page.getByRole('button', { name: 'Edit' }).click();

//     const updatedSpecialism = 'Updated Automation';
//     const updatedBio = 'Teacher-modified bio for student.';

//     await page.locator('input[name="specialism"]').fill(updatedSpecialism);
//     await page.locator('textarea[name="bio"]').fill(updatedBio);

//     await page.getByRole('button', { name: 'Save' }).click();
//     await page.waitForURL('**/');
//     await expect(page.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

//     await page.goto(`/profile/${student.id}`);
//     await expectProfileLoaded(page);

//     await expect(page.locator('input[name="specialism"]')).toHaveValue(updatedSpecialism);
//     await expect(page.locator('textarea[name="bio"]')).toHaveValue(updatedBio);
//   });

//   test('Renders training vs professional sections based on role', async ({ page }) => {
//     await login(page, student);
//     await page.goto(`/profile/${student.id}`);
//     await expectProfileLoaded(page);
//     await expect(page.getByRole('heading', { name: 'Training info' })).toBeVisible();
//     await expect(page.getByRole('heading', { name: 'Professional info' })).toHaveCount(0);

//     await logoutIfLoggedIn(page);

//     await login(page, teacher);
//     await page.goto(`/profile/${teacher.id}`);
//     await expectProfileLoaded(page);
//     await expect(page.getByRole('heading', { name: 'Professional info' })).toBeVisible();
//     await expect(page.getByRole('heading', { name: 'Training info' })).toHaveCount(0);
//   });

//   test('Bio textarea enforces max length and updates counter', async ({ page }) => {
//     await login(page, teacher);

//     await page.goto(`/profile/${teacher.id}`);
//     await expectProfileLoaded(page);

//     await page.getByRole('button', { name: 'Edit' }).click();

//     const bio = page.locator('textarea[name="bio"]');
//     await bio.fill('A'.repeat(400));

//     const value = await bio.inputValue();
//     expect(value.length).toBe(300);
//     await expect(page.locator('#charCount')).toHaveText('300/300');
//   });
// });
