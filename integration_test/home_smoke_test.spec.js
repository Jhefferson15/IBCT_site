const { test, expect } = require('@playwright/test');

test('Home page loads and shows the hero title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Uma família para pertencer');
});

test('Should show login button when not logged in', async ({ page }) => {
  await page.goto('/');
  // Espera o container existir
  const container = page.locator('#user-session-container');
  await expect(container).toBeAttached();
  
  // Tenta encontrar o link de login
  const loginLink = page.getByRole('link', { name: 'Login' });
  await expect(loginLink).toBeVisible({ timeout: 10000 });
});
