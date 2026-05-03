const { test, expect } = require('@playwright/test');

const departments = [
    'diaconia',
    'embaixadores-do-rei',
    'louvor-e-adoracao',
    'mensageiras-do-rei',
    'ministerio-cross',
    'ministerio-da-familia',
    'ministerio-da-liga',
    'ministerio-de-casais',
    'ministerio-infantil'
];

test.describe('Consistência dos Sub-sites de Departamentos', () => {
    for (const dept of departments) {
        test(`validar consistência do departamento: ${dept}`, async ({ page }) => {
            const filePath = `departamentos/${dept}/${dept}_home.html`;
            await page.goto(filePath);

            // Verificar se o og:site_name não é mais "Hodos Juventude" (exceto se for o Hodos, mas ele não está na lista)
            const ogSiteName = await page.getAttribute('meta[property="og:site_name"]', 'content');
            expect(ogSiteName).not.toBe('Hodos Juventude');
            expect(ogSiteName).toContain('IBCT');

            // Verificar se links quebrados legados foram removidos
            const links = await page.locator('nav.nav-links a').allInnerTexts();
            expect(links).not.toContain('Loja');
            expect(links).not.toContain('EBD');
            expect(links).not.toContain('Sobre Nós');

            // Verificar se a seção "Conheça" foi renomeada (não deve conter "hodos" no ID ou título se não for Hodos)
            const sections = await page.locator('section').all();
            for (const section of sections) {
                const id = await section.getAttribute('id');
                if (id) {
                    expect(id).not.toBe('conheca-hodos');
                }
            }
        });
    }
});
