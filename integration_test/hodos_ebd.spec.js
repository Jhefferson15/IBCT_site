const { test, expect } = require('@playwright/test');

test.describe('Hodos EBD Page Tests', () => {

    test.beforeEach(async ({ page }) => {
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`Browser console error: "${msg.text()}"`);
            }
        });
    });

    test('Hodos EBD page should load and display essential elements', async ({ page }) => {
        await page.goto('/departamentos/hodos/hodos_ebd.html', { waitUntil: 'networkidle' });
        
        // Verificar título
        await expect(page).toHaveTitle(/Escola Bíblica Dominical/);
        
        // Verificar se o header está presente
        await expect(page.locator('header.header')).toBeVisible();
        
        // Verificar se o hero section está visível
        await expect(page.locator('.hero h1')).toContainText('Escola Bíblica Dominical');
        
        // Verificar countdown
        await expect(page.locator('.countdown-timer')).toBeVisible();
        
        // Verificar se as aulas são renderizadas
        const lessonsScroller = page.locator('.lessons-scroller');
        await expect(lessonsScroller).toBeVisible();
        
        // Deve haver pelo menos o card de resumo de Filipenses
        const summaryCard = page.locator('.summary-card');
        await expect(summaryCard).toBeVisible();
        
        // Verificar se há cards de aula (Colossenses)
        const lessonCards = page.locator('.lesson-card');
        const count = await lessonCards.count();
        console.log(`Found ${count} lesson cards`);
        expect(count).toBeGreaterThan(1); // Sumário + pelo menos uma aula
    });

    test('Should open lesson details modal', async ({ page }) => {
        await page.goto('/departamentos/hodos/hodos_ebd.html', { waitUntil: 'networkidle' });
        
        // Clicar no primeiro card de aula (que não seja o sumário se possível, ou o próprio sumário)
        const firstLessonCard = page.locator('.lesson-card:not(.summary-card)').first();
        await firstLessonCard.click();
        
        // Verificar se o modal abriu
        const modal = page.locator('#lesson-modal');
        await expect(modal).toHaveClass(/active/);
        
        // Verificar conteúdo do modal
        await expect(page.locator('#modal-title')).not.toBeEmpty();
        
        // Fechar modal
        await page.click('#lesson-modal .modal-close');
        await expect(modal).not.toHaveClass(/active/);
    });

    test('Toggle lessons button should work', async ({ page }) => {
        await page.goto('/departamentos/hodos/hodos_ebd.html', { waitUntil: 'networkidle' });
        
        const toggleBtn = page.locator('#toggle-lessons-btn');
        const initialText = await toggleBtn.innerText();
        
        await toggleBtn.click();
        
        const newText = await toggleBtn.innerText();
        expect(initialText).not.toBe(newText);
        
        const lessonsTitle = page.locator('#lessons-title');
        await expect(lessonsTitle).toContainText('Aulas Passadas');
    });
});
