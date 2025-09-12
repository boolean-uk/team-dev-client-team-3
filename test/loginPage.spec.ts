import { test, expect } from 'playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('console', (msg) => console.log('[browser]', msg.type(), msg.text()));
  page.on('request', (req) => console.log('[request]', req.method(), req.url()));
  page.on('response', (res) => console.log('[response]', res.status(), res.url()));
  page.on('requestfailed', (req) => console.log('[failed]', req.failure()?.errorText, req.url()));
});

const validUser1 = { email: 'oyvind.perez1@example.com', password: 'SuperHash!4' };
const invalidUserWrongPassword = { email: 'oyvind.perez1@example.com', password: 'WrongPassword' };
const invalidUserUnknown = { email: 'unknown.user@example.com', password: 'AnyPassword1!' };

test('Login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
});

test('Logs in and sees dashboard + nav', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email *').fill(validUser1.email);
  await page.getByLabel('Password *').fill(validUser1.password);
  await page.getByRole('button', { name: /log in/i }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: /my cohort/i })).toBeVisible();

  // Navigation items exist with correct labels and hrefs
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();

  const home = nav.getByRole('link', { name: 'Home' });
  await expect(home).toHaveAttribute('href', '/');
  await expect(home).toHaveAttribute('aria-current', 'page');

  const profile = nav.getByRole('link', { name: 'Profile' });
  await expect(profile).toHaveAttribute('href', '/profile');

  const cohort = nav.getByRole('link', { name: 'Cohort' });
  await expect(cohort).toHaveAttribute('href', '/cohort');
});

test('Shows server error on wrong password', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email *').fill(invalidUserWrongPassword.email);
  await page.getByLabel('Password *').fill(invalidUserWrongPassword.password);
  await page.getByRole('button', { name: /log in/i }).click();

  const errorMsg = page.locator('[aria-label="loginErrorMessage"]');
  await expect(errorMsg).toBeVisible({ timeout: 15000 });
  await expect(errorMsg).toHaveText(/\S+/, { timeout: 15000 });
});

test('Shows server error on unknown user', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email *').fill(invalidUserUnknown.email);
  await page.getByLabel('Password *').fill(invalidUserUnknown.password);
  await page.getByRole('button', { name: /log in/i }).click();

  const errorMsg = page.locator('[aria-label="loginErrorMessage"]');
  await expect(errorMsg).toBeVisible({ timeout: 15000 });
  await expect(errorMsg).toHaveText(/\S+/, { timeout: 15000 });
});
