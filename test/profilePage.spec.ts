import { test, expect } from 'playwright/test';
import { signUpThroughUI, login, logoutIfLoggedIn, expectProfileLoaded, warmApi, TestUserData } from './helpers';

test.describe.serial('Profile Page General tests', () => {
    let student: TestUserData;
    const teacher = { email: 'oyvind.perez1@example.com', password: 'SuperHash!4', id: 1 }

    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext();
        const page = await ctx.newPage();
        await warmApi(page);
        await logoutIfLoggedIn(page)
        student = await signUpThroughUI(page);
        await logoutIfLoggedIn(page)
        await ctx.close();
    });

    test.afterEach(async ({ page }) => {
        await logoutIfLoggedIn(page);
    });

    test('Student can edit own profile and sees saved values', async ({ page }) => {
        await login(page, student)
        await page.goto(`/profile/${student.id}`);
        await expectProfileLoaded(page);

        await expect(page.locator('input[name="firstName"]')).toBeDisabled();
        await page.getByRole('button', { name: 'Edit' }).click();

        const newFirst = `${student.firstName} Updated`;
        const newBio = `${student.bio} Updated`;

        await page.locator('input[name="firstName"]').fill(newFirst);
        await page.locator('textarea[name="bio"]').fill(newBio);

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

        await page.goto(`/profile/${student.id}`);
        await expectProfileLoaded(page);
        await expect(page.locator('input[name="firstName"]')).toHaveValue(newFirst);
        await expect(page.locator('textarea[name="bio"]')).toHaveValue(newBio);
    });

    test('Student views a teacher profile as read-only (no password field)', async ({ page }) => {
        await login(page, student)

        await page.goto(`/profile/${1}`); // Oyvind Perez
        await expectProfileLoaded(page);

        await expect(page.getByRole('heading', { name: 'Professional info' })).toBeVisible();

        await expect(page.locator('input[name="firstName"]')).toBeDisabled();
        await expect(page.locator('input[name="email"]')).toBeDisabled();
        await expect(page.locator('input[name="mobile"]')).toBeDisabled();
        await expect(page.locator('textarea[name="bio"]')).toBeDisabled();

        await expect(page.getByRole('button', { name: 'Edit' })).toHaveCount(0);
        await expect(page.locator('input[name="password"]')).toHaveCount(0);
    });

    test('Teacher can edit a student profile and persist changes', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel('Email *').fill(teacher.email);
        await page.getByLabel('Password *').fill(teacher.password);
        await page.getByRole('button', { name: /log in/i }).click();
        await expect(page.getByRole('heading', { name: /cohorts/i })).toBeVisible();

        await page.goto(`/profile/${student.id}`);
        await expectProfileLoaded(page);

        await page.getByRole('button', { name: 'Edit' }).click();

        const updatedSpecialism = `${student.specialism} Updated by teacher`;
        const updatedBio = `${student.bio} Updated by teacher`;

        await page.locator('input[name="specialism"]').fill(updatedSpecialism);
        await page.locator('textarea[name="bio"]').fill(updatedBio);

        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByRole('button', { name: "What's on your mind?" })).toBeVisible();

        await page.goto(`/profile/${student.id}`);
        await expectProfileLoaded(page);

        await expect(page.locator('input[name="specialism"]')).toHaveValue(updatedSpecialism);
        await expect(page.locator('textarea[name="bio"]')).toHaveValue(updatedBio);
    });

    test('Bio textarea enforces max length and updates counter', async ({ page }) => {
        await login(page, student);
        await page.goto(`/profile/${student.id}`);
        await expectProfileLoaded(page);

        await page.getByRole('button', { name: 'Edit' }).click();
        await page.locator('textarea[name="bio"]').fill('A'.repeat(400));

        const value = await page.locator('textarea[name="bio"]').inputValue();
        expect(value.length).toBe(300);
        await expect(page.locator('#charCount')).toHaveText('300/300');
    });

    test('Renders training vs professional sections based on role', async ({ page }) => {
        await login(page, student);
        await page.goto(`/profile/${student.id}`);
        await expectProfileLoaded(page);
        await expect(page.getByRole('heading', { name: 'Training info' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Professional info' })).toHaveCount(0);

        await logoutIfLoggedIn(page);

        await page.goto('/login');
        await page.getByLabel('Email *').fill(teacher.email);
        await page.getByLabel('Password *').fill(teacher.password);
        await page.getByRole('button', { name: /log in/i }).click();
        await expect(page.getByRole('heading', { name: /cohorts/i })).toBeVisible();

        await page.goto(`/profile/${teacher.id}`);
        await expectProfileLoaded(page);
        await expect(page.getByRole('heading', { name: 'Professional info' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Training info' })).toHaveCount(0);
    });
});
