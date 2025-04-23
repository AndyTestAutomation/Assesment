import { chromium } from '@playwright/test';
import * as fs from 'fs/promises';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to GitHub login page
  await page.goto('https://github.com/login');

  // Manually log in to GitHub in the browser window that opens
  console.log('Please log in to GitHub manually in the opened browser window.');

  // Wait for the user to log in
  await page.waitForSelector('header[role="banner"]', { timeout: 120000 }); // Wait for up to 2 minutes

  // Save cookies
  const cookies = await context.cookies();
  await fs.writeFile('./cookies/cookies.js', `export default ${JSON.stringify(cookies, null, 2)};`);
  console.log('✅ Cookies saved successfully to cookies.js');

  await browser.close();
})();