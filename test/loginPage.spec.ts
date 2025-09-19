import { test, expect, type Page, type Response } from 'playwright/test';
import { loginThroughUI, resolveUserIdFromLocalStorage } from './helpers';

const validUser = { email: 'oyvind.perez1@example.com', password: 'SuperHash!4' };
const invalidUserWrongPassword = { email: 'oyvind.perez1@example.com', password: 'WrongPassword' };
const invalidUserUnknown = { email: 'unknown.user@example.com', password: 'AnyPassword1!' };

const submitLogin = async (page: Page, credentials: { email: string; password: string }): Promise<Response> => {
  const loginRequest = page.waitForResponse(
    (response) => response.url().includes('/login') && response.request().method() === 'POST'
  );

  const emailInput = page.getByLabel('Email *');
  const passwordInput = page.getByLabel('Password *');
  const submitButton = page.getByRole('button', { name: /log in/i });

  await expect(emailInput).toBeVisible();
  await expect(passwordInput).toBeVisible();
  await expect(submitButton).toBeEnabled();

  await emailInput.fill(credentials.email);
  await passwordInput.fill(credentials.password);
  await submitButton.click();

  return await loginRequest;
};

test.describe('Login page', () => {
  test('renders expected form controls', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByLabel('Email *')).toBeVisible();

    const passwordInput = page.getByLabel('Password *');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    const rememberMe = page.getByLabel('Remember me');
    await expect(rememberMe).toBeVisible();
    await expect(rememberMe).toHaveAttribute('type', 'checkbox');

    const signUpLink = page.getByRole('link', { name: /sign up/i });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/register');

    await expect(page.getByRole('button', { name: /log in/i })).toBeEnabled();
  });

  test('authenticates a valid user and renders navigation', async ({ page }) => {
    await loginThroughUI(page, validUser);

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /cohorts/i })).toBeVisible();

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    const home = nav.getByRole('link', { name: 'Home' });
    await expect(home).toHaveAttribute('href', '/');
    await expect(home).toHaveAttribute('aria-current', 'page');

    const resolvedUserId = await resolveUserIdFromLocalStorage(page);
    const profileLink = nav.getByRole('link', { name: 'Profile' });
    await expect(profileLink).toHaveAttribute('href', `/profile/${resolvedUserId}`);

    const cohortLink = nav.getByRole('link', { name: 'Cohort' });
    await expect(cohortLink).toHaveAttribute('href', '/cohort');

    const storedUser = await page.evaluate(() => window.localStorage.getItem('user'));
    expect(storedUser).not.toBeNull();
    const parsed = storedUser ? JSON.parse(storedUser) : {};
    expect(parsed.email).toBe(validUser.email);
  });

  test('rejects a valid email with wrong password', async ({ page }) => {
    await page.goto('/login');

    const response = await submitLogin(page, invalidUserWrongPassword);
    expect(response.ok()).toBeFalsy();
    expect([400, 401]).toContain(response.status());

    const errorMsg = page.locator('[aria-label="loginErrorMessage"]');
    await expect(errorMsg).toBeVisible({ timeout: 15_000 });
    await expect(errorMsg).toHaveText(/\S+/, { timeout: 15_000 });

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('nav')).toHaveCount(0);

    const token = await page.evaluate(() => window.localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('rejects an unknown user and keeps session clean', async ({ page }) => {
    await page.goto('/login');

    const response = await submitLogin(page, invalidUserUnknown);
    expect(response.ok()).toBeFalsy();
    expect([400, 401]).toContain(response.status());

    const errorMsg = page.locator('[aria-label="loginErrorMessage"]');
    await expect(errorMsg).toBeVisible({ timeout: 15_000 });
    await expect(errorMsg).toHaveText(/\S+/, { timeout: 15_000 });

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('nav')).toHaveCount(0);

    const user = await page.evaluate(() => window.localStorage.getItem('user'));
    expect(user).toBeNull();
  });

  test('clears login errors after a successful retry', async ({ page }) => {
    await page.goto('/login');

    const failedResponse = await submitLogin(page, invalidUserWrongPassword);
    expect([400, 401]).toContain(failedResponse.status());
    const errorMsg = page.locator('[aria-label="loginErrorMessage"]');
    await expect(errorMsg).toBeVisible({ timeout: 15_000 });

    const tokenAfterFailure = await page.evaluate(() => window.localStorage.getItem('token'));
    expect(tokenAfterFailure).toBeNull();

    const successResponse = await submitLogin(page, validUser);
    expect(successResponse.ok()).toBeTruthy();

    await expect(page).toHaveURL('/');
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('[aria-label="loginErrorMessage"]')).toHaveCount(0);

    const tokenAfterSuccess = await page.evaluate(() => window.localStorage.getItem('token'));
    expect(tokenAfterSuccess).not.toBeNull();
  });
});
