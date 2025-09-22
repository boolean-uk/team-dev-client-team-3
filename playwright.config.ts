import { defineConfig, devices } from 'playwright/test';

export default defineConfig({
  testDir: './test',
  workers: 2,
  testMatch: /.*\.spec\.ts/,
  timeout: 20_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: 2,
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
      REACT_APP_API_URL: 'https://localhost:7233',
    },
  },
  outputDir: 'test-results',
});
