const { test, expect } = require('@playwright/test');

test.describe('Padronização de Temas e Persistência', () => {
    
    test('Deve alternar o tema ao clicar no botão e persistir após recarregar', async ({ page }) => {
        await page.goto('/');

        // 1. Verifica se o botão de tema existe
        const themeToggle = page.locator('#theme-toggle');
        await expect(themeToggle).toBeVisible();

        // 2. Verifica se o tema inicial é light (padrão)
        await expect(page.locator('body')).not.toHaveClass(/dark-theme/);

        // 3. Clica para mudar para dark
        await themeToggle.click();
        await expect(page.locator('body')).toHaveClass(/dark-theme/);

        // 4. Recarrega a página e verifica se continua dark
        await page.reload();
        await expect(page.locator('body')).toHaveClass(/dark-theme/);

        // 5. Clica para voltar para light
        await themeToggle.click();
        await expect(page.locator('body')).not.toHaveClass(/dark-theme/);

        // 6. Recarrega novamente e verifica se continua light
        await page.reload();
        await expect(page.locator('body')).not.toHaveClass(/dark-theme/);
    });

    test('O tema deve ser compartilhado entre diferentes páginas', async ({ page }) => {
        await page.goto('/');

        // Ativa modo escuro na Home
        await page.locator('#theme-toggle').click();
        await expect(page.locator('body')).toHaveClass(/dark-theme/);

        // Navega para a página Sobre
        await page.goto('/sobre_ibct.html');
        
        // Verifica se a página Sobre já carrega com o modo escuro
        await expect(page.locator('body')).toHaveClass(/dark-theme/);
    });
});
