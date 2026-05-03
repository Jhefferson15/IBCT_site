const { test, expect } = require('@playwright/test');

test('Admin Login page loads', async ({ page }) => {
  await page.goto('/src/features/admin/presentation/AdminLogin.html');
  await expect(page.locator('h1, h2')).toContainText('Painel Administrativo');
});

test('Admin Dashboard page loads', async ({ page }) => {
  await page.goto('/src/features/admin/presentation/AdminDashboard.html');
  // Usually redirects if not logged in, but we check if it at least exists
  const title = await page.title();
  expect(title).toContain('Admin');
});
