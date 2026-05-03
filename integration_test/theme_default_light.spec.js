const { test, expect } = require('@playwright/test');

test.describe('Tema Padrão Claro', () => {
    
    test('Deve iniciar no tema claro mesmo se o sistema preferir escuro', async ({ page }) => {
        // Simula a preferência de sistema 'dark'
        await page.emulateMedia({ colorScheme: 'dark' });
        
        await page.goto('/');

        // 1. Verifica se o corpo NÃO tem a classe 'dark-theme'
        const body = page.locator('body');
        await expect(body).not.toHaveClass(/dark-theme/);
        
        // 2. Verifica se as variáveis de cor são as do tema claro
        // No tema claro, --bg-color geralmente é #f4f4f4 ou similar (conforme base/variables.css)
        // No tema escuro é #121212
        const bgColor = await body.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue('background-color');
        });
        
        // Se não for dark-theme, o background não deve ser o escuro (#121212 -> rgb(18, 18, 18))
        expect(bgColor).not.toBe('rgb(18, 18, 18)');
    });

    test('Deve permitir mudar para o tema escuro manualmente', async ({ page }) => {
        await page.goto('/');
        
        const themeToggle = page.locator('#theme-toggle');
        await themeToggle.click();
        
        await expect(page.locator('body')).toHaveClass(/dark-theme/);
        
        // Recarrega para garantir persistência (opcional, mas bom)
        await page.reload();
        await expect(page.locator('body')).toHaveClass(/dark-theme/);
    });
});
