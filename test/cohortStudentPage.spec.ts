import { test, expect } from 'playwright/test';
import { signUpThroughUI, login, logoutIfLoggedIn, expectProfileLoaded, warmApi, TestUserData } from './helpers';

test.describe.serial('Cohort Student Page General tests', () => {
    let student: TestUserData;

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

    test('Student can view own cohort student page, students and teachers', async ({ page }) => {
        await login(page, student)
        await page.goto(`/cohort`);
        await expectProfileLoaded(page);

        await expect(page.getByRole('heading', { name: 'Software Development' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Students' })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Teachers' })).toBeVisible();
    });

});
