import { test, expect } from 'playwright/test';

const getNewTestUser = () => {
    const salt = Date.now()

    // number of milliseconds in one day
    const ONE_DAY = 24 * 60 * 60 * 1000

    const startDate = new Date(salt + 7 * ONE_DAY) // 7 days in the future
    const endDate = new Date(salt + 14 * ONE_DAY) // 14 days in the future

    return {
        email: `test_email_${salt}@example.com`,
        password: 'SuperHash!4',
        firstName: 'Test',
        lastName: 'Man',
        username: `test-user-${salt}`,
        githubUsername: `gh-user-${salt}`,
        mobile: '+4712345678',
        role: 0,
        specialism: `Test-developer ${salt}`,
        cohort: 'Cohort 1',
        startDate,  // Date object
        endDate,    // Date object
        bio: `Test-developer bio with salt: ${salt}`
    }
}

test('Navigates to Register from Login via Sign up and shows heading', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: /sign up/i }).click();

    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1.credentials-title.h3')).toHaveText('Register');
});

test('Sign up with email and strong password', async ({ page }) => {
    const user = getNewTestUser();

    await page.goto('/register');

    await page.getByLabel('Email *').fill(user.email);
    await page.getByLabel('Password *').fill(user.password);

    await expect(page.locator('#email')).toHaveValue(user.email);
    await expect(page.locator('#password')).toHaveValue(user.password);

    await expect(page.locator('ul.password-hint-3 li.valid')).toHaveCount(4);
    const signUpBtn = page.getByRole('button', { name: /sign up/i });
    await expect(signUpBtn).toBeVisible();

    await signUpBtn.click();

    await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});

test('Fill registration form with email and strong password', async ({ page }) => {
    const user = getNewTestUser();
    await page.goto('/register');

    await page.getByLabel('Email *').fill(user.email);
    await page.getByLabel('Password *').fill(user.password);

    await expect(page.locator('#email')).toHaveValue(user.email);
    await expect(page.locator('#password')).toHaveValue(user.password);

    await expect(page.locator('ul.password-hint-3 li.valid')).toHaveCount(4);
    const signUpBtn = page.getByRole('button', { name: /sign up/i });
    await expect(signUpBtn).toBeVisible();

    await signUpBtn.click();

    await expect(page.locator('h1.h3')).toHaveText('Welcome to Cohort Manager', { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

    // Proceed to profile creation wizard
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 1: Basic info
    await expect(page.locator('form.welcome-form')).toBeVisible();

    await page.getByLabel('First name*').fill(user.firstName);
    await page.getByLabel('Last name*').fill(user.lastName);
    await page.getByLabel('Username*').fill(user.username);
    await page.getByLabel('Github Username').fill(user.githubUsername);

    // Trigger server-side validation via blur
    await page.getByLabel('Github Username').blur();
    await page.getByLabel('Username*').blur();

    const nextBtn = page.getByRole('button', { name: 'Next' });
    await expect(nextBtn).toBeEnabled({ timeout: 30000 });
    await nextBtn.click();

    // Step 2: Contact info
    await expect(page.getByLabel('Email*')).toHaveValue(user.email);
    await expect(page.getByLabel('Email*')).toBeDisabled();
    await page.getByLabel('Mobile*').fill(user.mobile);
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 3: Training info
    const startISO = new Date(user.startDate).toISOString().slice(0, 10);
    const endISO = new Date(user.endDate).toISOString().slice(0, 10);

    await page.getByLabel('Role*').fill(String(user.role));
    await page.getByLabel('Specialism*').fill(user.specialism);
    await page.getByLabel('Cohort*').fill(user.cohort);
    await page.getByLabel('Start Date*').fill(startISO);
    await page.getByLabel('End Date*').fill(endISO);

    await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
    await page.getByRole('button', { name: 'Next' }).click();

    // Step 4: Bio and submit button present
    await page.locator('textarea[name="bio"]').fill(user.bio);
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await page.getByRole('button', { name: 'Submit' }).click();

    const createPost = page.locator('.create-post-input');
    await expect(createPost).toBeVisible();
    await expect(createPost.locator('.profile-circle')).toBeVisible();
    await expect(createPost.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

});
