const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './integration_test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5500',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx http-server . -p 5500 -c-1',
    url: 'http://localhost:5500',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
