// import { test, expect } from 'playwright/test';
// import { getNewTestUser } from './helpers';

// test('Navigates to Register from Login via Sign up and shows heading', async ({ page }) => {
//     await page.goto('/login');

//     await page.getByRole('link', { name: /sign up/i }).click();

//     await expect(page).toHaveURL('/register');
//     await expect(page.locator('h1.credentials-title.h3')).toHaveText('Register');
// });

// test('Sign up with email and strong password', async ({ page }) => {
//     const user = getNewTestUser();

//     await page.goto('/register');

//     await page.locator('input[name="email"]').fill(user.email);
//     await page.locator('input[name="password"]').fill(user.password);

//     await expect(page.locator('#email')).toHaveValue(user.email);
//     await expect(page.locator('#password')).toHaveValue(user.password);

//     await expect(page.locator('ul.password-hint-3 li.valid')).toHaveCount(4);
//     const signUpBtn = page.getByRole('button', { name: /sign up/i });
//     await expect(signUpBtn).toBeVisible();

//     await signUpBtn.click();

//     await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30000 });
//     await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
// });

// test('Fill registration form with email and strong password', async ({ page }) => {
//     const user = getNewTestUser();
//     await page.goto('/register');

//     await page.locator('input[name="email"]').fill(user.email);
//     await page.locator('input[name="password"]').fill(user.password);

//     await expect(page.locator('#email')).toHaveValue(user.email);
//     await expect(page.locator('#password')).toHaveValue(user.password);

//     await expect(page.locator('ul.password-hint-3 li.valid')).toHaveCount(4);
//     const signUpBtn = page.getByRole('button', { name: /sign up/i });
//     await expect(signUpBtn).toBeVisible();

//     await signUpBtn.click();

//     await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30000 });
//     await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

//     // Proceed to profile creation wizard
//     await page.getByRole('button', { name: 'Continue' }).click();

//     // Step 1: Basic info
//     await expect(page.locator('form.welcome-form')).toBeVisible();

//     await page.locator('input[name="firstName"]').fill(user.firstName);
//     await page.locator('input[name="lastName"]').fill(user.lastName);
//     await page.locator('input[name="username"]').fill(user.username);
//     await page.locator('input[name="githubUsername"]').fill(user.githubUsername);

//     // Trigger server-side validation via blur
//     await page.locator('input[name="githubUsername"]').blur();
//     await page.locator('input[name="username"]').blur();

//     const nextBtn = page.getByRole('button', { name: 'Next' });
//     await expect(nextBtn).toBeEnabled({ timeout: 30000 });
//     await nextBtn.click();

//     // Step 2: Contact info
//     await expect(page.locator('input[name="email"]')).toHaveValue(user.email);
//     await expect(page.locator('input[name="email"]')).toBeDisabled();
//     await page.locator('input[name="mobile"]').fill(user.mobile);
//     await page.getByRole('button', { name: 'Next' }).click();

//     // Step 3: Training info
//     const startISO = new Date(user.startDate).toISOString().slice(0, 10);
//     const endISO = new Date(user.endDate).toISOString().slice(0, 10);

//     await page.locator('input[name="role"]').fill(String(user.role));
//     await page.locator('input[name="specialism"]').fill(user.specialism);
//     await page.locator('input[name="cohort"]').fill(user.cohort);
//     await page.locator('input[name="startDate"]').fill(startISO);
//     await page.locator('input[name="endDate"]').fill(endISO);

//     await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
//     await page.getByRole('button', { name: 'Next' }).click();

//     // Step 4: Bio and submit button present
//     await page.locator('textarea[name="bio"]').fill(user.bio);
//     await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
//     await page.getByRole('button', { name: 'Submit' }).click();

//     const createPost = page.locator('.create-post-input');
//     await expect(createPost).toBeVisible();
//     await expect(createPost.locator('.profile-circle')).toBeVisible();
//     await expect(createPost.getByRole('button', { name: "What's on your mind?" })).toBeVisible();
// });
