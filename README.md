# GitHub Playwright E2E Tests

This project contains:
- UI end-to-end tests using Playwright that simulate real user behavior.
- Mocked API interactions using Playwright's `page.route()` for testing edge cases.

## Getting Started

### Setup

1. Install dependencies:

   ```bash
   npm install
   npx playwright install
   ```

2. (Optional) If authentication is required, generate cookies for your GitHub session:
   - Run the `save-cookies.js` script:
     ```bash
     node save-cookies.js
     ```
   - Log in manually when prompted, and the cookies will be saved to `cookies.json`.

3. Run Playwright E2E tests:

   ```bash
   npx playwright test
   ```

### Running Specific Tests

To run a specific test file, use:

```bash
npx playwright test tests/e2e/<test-file-name>.test.ts
```

### Debugging Tests

Run tests in headed mode for debugging:

```bash
npx playwright test --headed
```

Use the Playwright Inspector for step-by-step debugging:

```bash
npx playwright test --debug
```

## CI

Tests are automatically run using GitHub Actions on push and pull requests. The workflow is defined in `.github/workflows/test.yml`.

---

**Note:** Ensure sensitive files like `cookies.json` are not committed to the repository. Add them to `.gitignore` if necessary.
