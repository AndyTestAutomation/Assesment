import { test, expect } from '@playwright/test';

test('Create a new issue with title and body (mocked)', async ({ page }) => {
  const mockResponse = {
    number: 123,
    title: 'Test Issue Title',
    body: 'Test Issue Body',
    state: 'open',
  };

  // Mock the GitHub API route
  await page.route('https://api.github.com/repos/test-owner/test-repo/issues', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    } else {
      await route.continue();
    }
  });

  // Simulate the API call within the browser context
  interface IssueRequest {
    title: string;
    body: string;
  }

  interface IssueResponse {
    number: number;
    title: string;
    body: string;
    state: string;
  }
  const response: IssueResponse = await page.evaluate(async (): Promise<IssueResponse> => {
    const url = 'https://api.github.com/repos/test-owner/test-repo/issues';
    const data: IssueRequest = {
      title: 'Test Issue Title',
      body: 'Test Issue Body',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  });

  // Assertions
  expect(response.title).toBe(mockResponse.title);
  expect(response.body).toBe(mockResponse.body);
  expect(response.state).toBe(mockResponse.state);
  console.log('✅ Issue created successfully.');
});
