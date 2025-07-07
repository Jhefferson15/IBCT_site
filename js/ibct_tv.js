// js/ibct_tv.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MANIPULAÇÃO DE ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');

    // --- 2. LÓGICA DO MENU HAMBÚRGUER ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('modal-open', navLinks.classList.contains('active'));
        });
        
        // Fecha o menu se clicar em um link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
                document.body.classList.remove('modal-open');
            });
        });
    }

    // --- 3. BOTÃO VOLTAR AO TOPO & ANIMAÇÃO DE SCROLL ---
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 4. ANIMAÇÃO FADE-IN AO ROLAR ---
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
});