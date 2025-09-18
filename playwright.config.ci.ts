import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './test',
  testMatch: /.*\.spec\.ts/,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 3,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    // Always capture Playwright trace (includes network requests)
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      BROWSER: 'none',
      PORT: '3000',
      REACT_APP_API_URL: 'https://team-3-back-end.azurewebsites.net/',
    },
  },
  outputDir: 'test-results',
});
