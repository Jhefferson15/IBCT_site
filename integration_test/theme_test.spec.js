const { test, expect } = require('@playwright/test');

test('Deve permanecer no modo claro mesmo com preferência do sistema por modo escuro', async ({ page }) => {
  // Emula a preferência do sistema por modo escuro
  await page.emulateMedia({ colorScheme: 'dark' });
  
  await page.goto('/');
  
  // Verifica a cor de fundo do body. No modo claro (padrão), --cor-branco é #FFFFFF
  // No modo escuro (via classe), seria #121212
  const bodyBackgroundColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });

  // rgb(255, 255, 255) é #FFFFFF (modo claro)
  expect(bodyBackgroundColor).toBe('rgb(255, 255, 255)');
});

test('Deve ativar o modo escuro apenas quando a classe dark-theme for adicionada', async ({ page }) => {
  await page.goto('/');
  
  // Adiciona a classe dark-theme manualmente
  await page.evaluate(() => {
    document.body.classList.add('dark-theme');
  });
  
  const bodyBackgroundColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });

  // rgb(18, 18, 18) é #121212 (conforme definido no CSS para .dark-theme)
  expect(bodyBackgroundColor).toBe('rgb(18, 18, 18)');
});
