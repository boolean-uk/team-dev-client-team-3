import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: /.*\.spec\.ts/,
  timeout: 10_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    // The backend runs with ASP.NET Core dev HTTPS cert which is untrusted in CI.
    // Ignore TLS errors so browser requests to https://localhost:7233 succeed.
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: { BROWSER: 'none', PORT: '3000' },
  },
  outputDir: 'test-results',
});
