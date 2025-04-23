import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e', // Directory for Playwright tests
  timeout: 30000,
  retries: 1,
  use: {
    headless: true,
    baseURL: 'https://github.com',
  },
});