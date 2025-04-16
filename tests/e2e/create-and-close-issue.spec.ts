import { test, expect } from '@playwright/test';

test('Create and close an issue via GitHub UI', async ({ page }) => {
  await page.goto('https://github.com/login');
  await page.fill('input[name="login"]', process.env.GITHUB_USERNAME || '');
  await page.fill('input[name="password"]', process.env.GITHUB_PASSWORD || '');
  await page.click('input[type="submit"]');
  await page.waitForURL('**/dashboard');

  // Navigate to repo
  await page.goto('https://github.com/AndyTestAutomation/Assesment/issues');

  // Create new issue
  await page.click('a[href$="/issues/new"]');
  await page.fill('#issue_title', 'Playwright E2E Test Issue');
  await page.fill('#issue_body', 'This issue was created by an automated E2E test.');
  await page.click('button[type="submit"]');

  // Verify issue creation
  await expect(page.locator('span.js-issue-title')).toHaveText('Playwright E2E Test Issue');

  // Close the issue
  await page.click('button[title="Close issue"]');
  await expect(page.locator('span.State')).toHaveText(/Closed/);
});
