import { test, expect } from '@playwright/test';
import fs from 'fs';

test('Create and close an issue via GitHub UI', async ({ page, context }) => {
  // Load cookies from a file
  try {
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
    await context.addCookies(cookies);
    console.log('✅ Cookies loaded successfully');
  } catch (error) {
    console.error('❌ Failed to load cookies:', error);
    return; // Exit the test if cookies fail to load
  }

  // Navigate directly to the repository issues page
  await page.goto('https://github.com/AndyTestAutomation/Assesment/issues');

  // Create a new issue
  const issueTitle = 'Playwright E2E Test Issue';
  const issueBody = 'This issue was created by an automated E2E test.';
  await page.getByRole('link', { name: 'New issue' }).click();
  await page.getByRole('textbox', { name: 'Add a title' }).fill(issueTitle);
  await page.getByRole('textbox', { name: 'Markdown value' }).fill(issueBody);
  await page.getByTestId('create-issue-button').click();

  // Verify issue creation
  await expect(page.getByTestId('issue-title')).toHaveText(issueTitle);
  console.log('✅ Issue created successfully');

  // Navigate back to the list of issues and check that the issue is in the open list
  await page.goto('https://github.com/AndyTestAutomation/Assesment/issues');

  // Verify the number of open issues
  const openIssuesCountText = await page.getByRole('link', { name: /Open \(\d+\)/ }).innerText();
  const openIssuesCount = parseInt(openIssuesCountText.match(/\d+/)?.[0] || '0', 10);
  console.log(`✅ Number of open issues: ${openIssuesCount}`);

  // Assert that there is at least one open issue
  expect(openIssuesCount).toBeGreaterThan(0);

  // Locate the issue using partial name
  const issueLink = page
    .getByRole('listitem', { name: /Playwright E2E Test Issue:.*Status: Open/ }) // Use a regex to match partial name
    .getByTestId('issue-pr-title-link');

  // Ensure the issue link is visible
  await expect(issueLink.first()).toBeVisible({ timeout: 10000 }); // Wait for the first issue link to be visible
  console.log('✅ Located the issue successfully');

  // Click the issue link to open it
  await issueLink.first().click();
  console.log('✅ Opened the issue successfully');

  // Verify the issue title and body
  const actualIssueTitle = await page.getByTestId('issue-title').innerText();
  const actualIssueBody = await page.getByTestId('issue-body').innerText();

  // Log the content of the issue
  console.log(`🔍 Issue Title: ${actualIssueTitle}`);
  console.log(`🔍 Issue Body: ${actualIssueBody}`);

  // Verify the issue title and body match the expected values
  await expect(page.getByTestId('issue-title')).toHaveText(issueTitle); // Verify the issue title
  console.log('✅ Issue title verified successfully');
  const actualIssueBodyText = await page.getByTestId('issue-body').innerText();
  expect(actualIssueBodyText).toContain(issueBody); // Verify the issue body contains the expected text
  console.log('✅ Issue body verified successfully');

  // Add a delay to prevent the page from closing too quickly
  await page.waitForTimeout(2000);

  // Close the issue
  await page.getByRole('button', { name: 'Close issue' }).click(); // Confirm closing the issue

  // Verify the state label is 'Closed' after refreshing
  const stateLabel = page.getByTestId('issue-metadata-fixed').getByTestId('header-state');
  await expect(stateLabel).toBeVisible({ timeout: 10000 }); // Wait for the state label to be visible
  await expect(stateLabel).toHaveText('Closed'); // Verify the issue state is 'Closed'
  console.log('✅ Issue state is Closed');
});
