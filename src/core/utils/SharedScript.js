// js/shared-script.js
// Lógica compartilhada entre todas as páginas do site
import { ThemeManager } from '../theme/ThemeManager.js';

export function initSharedUI() {
    // Inicializa o tema assim que o UI é carregado
    ThemeManager.init();

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    const themeToggleBtn = document.querySelector('#theme-toggle');

    // Lógica do Menu Hambúrguer
    if (hamburger && navLinks) {
        console.log("Menu Hambúrguer inicializado com sucesso.");
        hamburger.addEventListener('click', (e) => {
            console.log("Clique no hamburger detectado.");
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('modal-open', navLinks.classList.contains('active'));
            console.log("Menu mobile ativo:", navLinks.classList.contains('active'));
        });
    }

    // Lógica de Alternância de Tema
    if (themeToggleBtn) {
        // Atualiza o ícone inicial
        updateThemeIcon(themeToggleBtn, ThemeManager.getStoredTheme());

        themeToggleBtn.addEventListener('click', () => {
            const newTheme = ThemeManager.toggle();
            updateThemeIcon(themeToggleBtn, newTheme);
        });
    }

    function updateThemeIcon(btn, theme) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Botão Voltar ao Topo
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animações de Fade-in
    if (fadeElements.length > 0) {
        const observerFadeIn = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        fadeElements.forEach(el => observerFadeIn.observe(el));
    }
}

export function openAnyModal(modal) {
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
}

export function closeAnyModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        const navLinks = document.querySelector('.nav-links');
        if (!document.querySelector('.modal-overlay.active') && (!navLinks || !navLinks.classList.contains('active'))) {
            document.body.classList.remove('modal-open');
        }
    }
}


