// filepath: c:\Users\Andy\Desktop\github-api-playwright-tests\save-cookies.js
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Launch browser in headed mode
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to GitHub login page
  await page.goto('https://github.com/login');

  // Log in manually
  console.log('Please log in to GitHub manually...');
  await page.waitForTimeout(30000); // Wait for 30 seconds to allow manual login

  // Save cookies to a file
  const cookies = await context.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log('✅ Cookies saved to cookies.json');

  await browser.close();
})();