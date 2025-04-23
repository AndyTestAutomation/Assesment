import { test, expect } from '@playwright/test';

test('Retrieve issues from a repository (mocked)', async ({ page }) => {
  const repoOwner = 'AndyTestAutomation';
  const repoName = 'Assesment';

  // Mock response data
  const mockIssues = [
    {
      id: 1,
      title: 'Mock Issue 1',
      state: 'open',
      body: 'This is a mock issue.',
    },
    {
      id: 2,
      title: 'Mock Issue 2',
      state: 'closed',
      body: 'This is another mock issue.',
    },
  ];

  // Intercept the API request and provide a mocked response
  await page.route(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockIssues),
    });
  });

  // Simulate the API call within the browser context
  const issues = await page.evaluate(async (url) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `token fake-token`, // No real token needed since it's mocked
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.json();
  }, `https://api.github.com/repos/${repoOwner}/${repoName}/issues`);

  // Assertions
  expect(Array.isArray(issues)).toBe(true); // Ensure the response is an array
  console.log(`✅ Found ${issues.length} issues.`);

  // Validate the structure of the first issue (if any)
  if (issues.length > 0) {
    const firstIssue = issues[0];
    expect(firstIssue.id).toBe(mockIssues[0].id);
    expect(firstIssue.title).toBe(mockIssues[0].title);
    expect(firstIssue.state).toBe(mockIssues[0].state);
    console.log(`🔍 First issue title: ${firstIssue.title}`);
  }
});
