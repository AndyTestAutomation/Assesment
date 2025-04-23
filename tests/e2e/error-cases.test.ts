import { test, expect } from '@playwright/test';

test('Create issue with missing title returns error (mocked)', async ({ page }) => {
  // Mock the GitHub API route
  await page.route('https://api.github.com/repos/test-owner/test-repo/issues', (route) => {
    if (route.request().method() === 'POST') {
      route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Validation Failed',
          errors: [{ resource: 'Issue', field: 'title', code: 'missing_field' }],
        }),
      });
    } else {
      route.continue();
    }
  });

  // Simulate the API call within the browser context
  const response = await page.evaluate(async (url) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token fake-token', // No real token needed since it's mocked
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title: '', // Missing title to trigger validation error
        body: 'Test Body',
      }),
    });
    return {
      status: res.status,
      body: await res.json(),
    };
  }, 'https://api.github.com/repos/test-owner/test-repo/issues');

  // Assertions
  expect(response.status).toBe(422);
  expect(response.body.message).toContain('Validation Failed');
  console.log('✅ Validation error successfully mocked and verified.');
});
