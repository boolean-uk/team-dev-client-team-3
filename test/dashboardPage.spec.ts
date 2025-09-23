import { test, expect } from 'playwright/test';
import { getValidToken } from './helpers';

test.describe.serial('Dashboard page', () => {
    let token: string;

    test.beforeAll(async () => {
        token = await getValidToken();
    });

    test.beforeEach(async ({ page }) => {
        // Inject token
        page.addInitScript((t) => {
            localStorage.setItem('token', t);
        }, token)
    });
    

    test('Dashboard loads', async ({ page }) => {    
        await page.goto('/');
    
        const createPostDiv = page.locator('div.create-post-input');
        await expect(createPostDiv).toBeVisible();
    });

    test('Shows posts', async ({ page }) => {
        await page.goto('/');
        
        const firstPost = page.locator('article.post').first();
        await expect(firstPost).toBeVisible();
    });

    test('Comment on post', async ({ page }) => {
        await page.goto('/');
        
        const firstPost = page.locator('article.post').first();
        await firstPost.getByText('Add Comment').click();

        const commentBox = firstPost.locator('textarea.comment-post-input');
        const commentText = `This is a slick comment ${Date.now()}`;
        await commentBox.fill(commentText);
        await commentBox.press('Enter');

        await expect(firstPost.getByText(commentText)).toBeVisible();
    });

    test('Edit a comment', async ({ page }) => {
        await page.goto('/');
        
        const firstPost = page.locator('article.post').first();
        await firstPost.getByText('Add Comment').click();

        const commentBox = firstPost.locator('textarea.comment-post-input');
        const commentText = `This is a slick comment ${Date.now()}`;
        await commentBox.fill(commentText);
        await commentBox.press('Enter');

        // Edit the content of the comment
        

        await expect(firstPost.getByText(commentText)).toBeVisible();
    });
});
