import { test, expect } from '@playwright/test';

test('Close an issue (mocked)', async ({ page }) => {
  const issueNumber = 123;

  // Mock response data
  const mockResponse = {
    number: issueNumber,
    state: 'closed',
    title: 'Mock Issue Title',
    body: 'This is a mock issue.',
  };

  // Intercept the PATCH request and provide a mocked response
  await page.route(`https://api.github.com/repos/test-owner/test-repo/issues/${issueNumber}`, (route) => {
    if (route.request().method() === 'PATCH') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    } else {
      route.continue();
    }
  });

  // Simulate the API call within the browser context
  const response = await page.evaluate(async ({ url, data }) => {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token fake-token', // No real token needed since it's mocked
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(data),
    });
    return {
      status: res.status,
      body: await res.json(),
    };
  }, { url: `https://api.github.com/repos/test-owner/test-repo/issues/${issueNumber}`, data: { state: 'closed' } });

  // Assertions
  expect(response.status).toBe(200);
  expect(response.body.state).toBe('closed');
  expect(response.body.number).toBe(issueNumber);
  console.log('✅ Issue closed successfully with mocked response.');
});
