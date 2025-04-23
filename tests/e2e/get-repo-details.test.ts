import { test, expect } from '@playwright/test';

test('Retrieve repository details (mocked)', async ({ page }) => {
  const repoOwner = 'AndyTestAutomation';
  const repoName = 'Assesment';

  // Mock the GitHub API response
  await page.route(`https://api.github.com/repos/${repoOwner}/${repoName}`, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 123456789,
        name: repoName,
        full_name: `${repoOwner}/${repoName}`,
        private: false,
        owner: {
          login: repoOwner,
        },
        description: 'This is a test repository for Playwright and API testing.',
        stargazers_count: 42,
        forks_count: 10,
      }),
    });
  });

  // Make the actual API call using Playwright's `page.evaluate`
  interface ApiResponse {
    status: number;
    data: {
      id: number;
      name: string;
      full_name: string;
      private: boolean;
      owner: {
        login: string;
      };
      description: string;
      stargazers_count: number;
      forks_count: number;
    };
  }

  interface Owner {
    login: string;
  }

  interface RepositoryDetails {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    description: string;
    stargazers_count: number;
    forks_count: number;
  }

  interface ApiResponse {
    status: number;
    data: RepositoryDetails;
  }

  const response: ApiResponse = await page.evaluate(
    async ({ repoOwner, repoName }: { repoOwner: string; repoName: string }): Promise<ApiResponse> => {
      const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}`, {
        headers: {
          Authorization: `token fake-token`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      const data: RepositoryDetails = await res.json();
      return { status: res.status, data };
    },
    { repoOwner, repoName }
  );

  // Assertions
  expect(response.status).toBe(200);
  expect(response.data.name).toBe(repoName);
  expect(response.data.full_name).toBe(`${repoOwner}/${repoName}`);
  expect(response.data.owner.login).toBe(repoOwner);
  expect(response.data.description).toContain('Playwright and API testing');
  expect(response.data.stargazers_count).toBeGreaterThan(0);
  expect(response.data.forks_count).toBeGreaterThan(0);
});