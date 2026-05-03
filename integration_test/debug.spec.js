const { test, expect } = require('@playwright/test');

test('Debug Home Script', async ({ page }) => {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('/');
  
  // Wait for 5 seconds to see if any errors pop up
  await page.waitForTimeout(5000);
  
  const container = page.locator('#user-session-container');
  await expect(container).toBeAttached();
  
  const html = await container.innerHTML();
  console.log('Container HTML:', html);
});
