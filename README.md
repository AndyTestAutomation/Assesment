# GitHub API & Playwright E2E Tests

This project contains:
- API tests using Jest and Axios with mocked data.
- UI end-to-end tests using Playwright that simulate real user behavior.

## Getting Started

### Setup

1. Install dependencies:

```bash
npm install
npx playwright install
```

2. Copy `.env.example` to `.env` and fill in your test GitHub credentials.

3. Run API tests:

```bash
npx jest
```

4. Run Playwright E2E tests:

```bash
npx playwright test
```

## CI

Tests are automatically run using GitHub Actions on push and pull requests.

**Note:** Use a dedicated test GitHub account for automation.
