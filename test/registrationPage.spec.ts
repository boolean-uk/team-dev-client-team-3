import { test, expect } from 'playwright/test';
import {
  getNewTestUser,
  registerThroughUI,
  waitForResponseOk,
  resolveUserIdFromLocalStorage
} from './helpers';

test('"Sign up"-button on login page loads registration page', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: /sign up/i }).click();

    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1.credentials-title.h3')).toHaveText('Register');
});

test('Sign up with email and strong password', async ({ page }) => {
  test.setTimeout(45_000);
  const user = getNewTestUser();

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

  const emailValidation = waitForResponseOk(
    page,
    (response) => {
      const url = response.url();
      return (
        url.includes(`/validation/email/${user.email}`) ||
        url.includes(`/validation/email/${encodeURIComponent(user.email)}`)
      );
    },
    'email validation'
  );
  const passwordValidation = waitForResponseOk(
    page,
    (response) =>
      response.url().includes('/validation/password') && response.request().method() === 'POST',
    'password validation'
  );
  const registerRequest = waitForResponseOk(
    page,
    (response) => response.url().endsWith('/users') && response.request().method() === 'POST',
    'user registration'
  );
  const autoLogin = waitForResponseOk(
    page,
    (response) => response.url().includes('/login') && response.request().method() === 'POST',
    'auto login after registration'
  );

  await signUpBtn.click();
  await Promise.all([emailValidation, passwordValidation, registerRequest, autoLogin]);

  await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30_000 });
  const token = await page.evaluate(() => window.localStorage.getItem('token'));
  expect(token).not.toBeNull();

  const storedUser = await page.evaluate(() => window.localStorage.getItem('user'));
  expect(storedUser).not.toBeNull();
  const parsed = storedUser ? JSON.parse(storedUser) : {};
  expect(parsed.email).toBe(user.email);

  const userId = await resolveUserIdFromLocalStorage(page);
  expect(Number.isFinite(userId)).toBeTruthy();
});

test('Completing the registration wizard persists profile data', async ({ page }) => {
  test.setTimeout(60_000);
  const user = await registerThroughUI(page);

  await expect(page).toHaveURL('/');
  await expect(page.locator('nav')).toBeVisible();

  const storedUser = await page.evaluate(() => window.localStorage.getItem('user'));
  expect(storedUser).not.toBeNull();
  const parsed = storedUser ? JSON.parse(storedUser) : {};
  expect(parsed.firstName).toBe(user.firstName);
  expect(parsed.email).toBe(user.email);

  await page.goto(`/profile/${user.id}`);
  await expect(page.getByRole('heading', { name: 'Basic info' })).toBeVisible();
  await expect(page.locator('input[name="firstName"]')).toHaveValue(user.firstName);
  await expect(page.locator('input[name="lastName"]')).toHaveValue(user.lastName);
  await expect(page.locator('input[name="email"]')).toHaveValue(user.email);
  await expect(page.locator('input[name="mobile"]')).toHaveValue(user.mobile);
  await expect(page.locator('textarea[name="bio"]')).toHaveValue(user.bio);
});
