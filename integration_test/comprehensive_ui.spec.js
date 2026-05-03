const { test, expect } = require('@playwright/test');

test.describe('Interface Comprehensive Tests', () => {

    // Helper para verificar erros de console
    test.beforeEach(async ({ page }) => {
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`Browser console error: "${msg.text()}"`);
            }
        });
    });

    test('All main pages should load without errors', async ({ page }) => {
        const pages = [
            { url: '/', title: 'Home' },
            { url: '/login.html', title: 'Login' },
            { url: '/sobre_ibct.html', title: 'Sobre' },
            { url: '/ibct_tv.html', title: 'IBCT TV' },
            { url: '/membros.html', title: 'Membros' },
            { url: '/privacy.html', title: 'Privacidade' },
            { url: '/terms.html', title: 'Termos' }
        ];

        for (const p of pages) {
            console.log(`Step: Navigating to ${p.url}`);
            await page.goto(p.url, { waitUntil: 'networkidle' });
            
            // Verificar se redirecionou para login (caso de /membros.html)
            const currentUrl = page.url();
            if (currentUrl.includes('login.html')) {
                console.log(`Redirected to login from ${p.url}`);
                await expect(page.locator('.login-container')).toBeVisible({ timeout: 5000 });
                continue;
            }

            expect(page.url()).toContain(p.url === '/' ? '' : p.url);
            
            // Verificar se o Header está presente
            console.log(`Checking header/footer on ${p.url}`);
            await expect(page.locator('header.header')).toBeVisible({ timeout: 5000 });
            await expect(page.locator('footer.footer')).toBeVisible({ timeout: 5000 });
        }
    });

    test('Navigation menu links should work', async ({ page }) => {
        await page.goto('/');
        
        // Testar link para IBCT TV
        await page.click('nav.nav-links a[href="ibct_tv.html"]');
        await expect(page).toHaveURL(/.*ibct_tv.html/);
        
        await page.goto('/');
        // Testar link para Sobre
        await page.click('nav.nav-links a[href="sobre_ibct.html"]');
        await expect(page).toHaveURL(/.*sobre_ibct.html/);
    });

    test('Login form validation', async ({ page }) => {
        await page.goto('/login.html');

        // Verificar elementos essenciais
        await expect(page.locator('h2')).toContainText('Área de Membros');
        await expect(page.locator('#email')).toBeVisible();
        await expect(page.locator('#password')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();

        // Tentar submeter vazio
        await page.click('button[type="submit"]');
        
        // O navegador deve impedir o submit se os campos são required, 
        // mas vamos verificar se o script de login trata erros
        await page.fill('#email', 'invalid@email.com');
        await page.fill('#password', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Esperar mensagem de erro (ajustar se o login for via Firebase e demorar)
        const errorMessage = page.locator('#error-message');
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('Mobile menu visibility', async ({ page }) => {
        // Configurar viewport mobile
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        const hamburger = page.locator('.hamburger');
        await expect(hamburger).toBeVisible();
        
        // Clicar no hamburger e verificar se o menu aparece (ajustar seletor se necessário)
        await hamburger.click();
        const navLinks = page.locator('.nav-links');
        // Geralmente ganha uma classe 'active' ou similar
        await expect(navLinks).toHaveClass(/active/);
    });

    test('IBCT TV should load videos and have working menu', async ({ page }) => {
        await page.goto('/ibct_tv.html', { waitUntil: 'networkidle' });
        
        // Esperar o carregamento (a mensagem de "Carregando..." deve sumir)
        // Verificamos se o texto muda para algo que não seja "Carregando..."
        const loadingMessage = page.locator('.loading-message');
        await expect(loadingMessage).not.toHaveText(/Carregando vídeos.../, { timeout: 15000 });
        
        console.log("Videos loading finished (either found or empty)");

        // Testar menu especificamente na página de TV
        await page.setViewportSize({ width: 375, height: 667 });
        const hamburger = page.locator('.hamburger');
        await expect(hamburger).toBeVisible();
        await hamburger.click();
        await expect(page.locator('.nav-links')).toHaveClass(/active/);
    });

    test('Footer legal links', async ({ page }) => {
        await page.goto('/');
        
        const privacyLink = page.locator('footer a[href="privacy.html"]');
        const termsLink = page.locator('footer a[href="terms.html"]');
        
        await expect(privacyLink).toBeVisible();
        await expect(termsLink).toBeVisible();
        
        await privacyLink.click();
        await expect(page).toHaveURL(/.*privacy.html/);
    });
});
