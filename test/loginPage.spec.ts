import { test, expect } from 'playwright/test';

const testUser1 = {email:'oyvind.perez1@example.com', password:'SuperHash!4'}

test('Login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
});

test('Logs in and sees dashboard + nav', async ({ page }) => {
  // Go to login and submit form
  await page.goto('/login');
  await page.getByLabel('Email *').fill(testUser1.email);
  await page.getByLabel('Password *').fill(testUser1.password);
  await page.getByRole('button', { name: /log in/i }).click();

  // Expect redirect to dashboard and content visible
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
