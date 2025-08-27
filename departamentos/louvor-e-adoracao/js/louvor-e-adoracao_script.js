document.addEventListener('ibct-api-ready', () => {

    // --- LÓGICA COMPARTILHADA (Menu, Modais, Scroll, Fade) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    }

    function openAnyModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }
    
    function closeAnyModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            // A lógica específica de cada modal (reset de vídeo, etc.)
            // deve ser tratada pelo seu próprio script ou manipulador de eventos.
            const iframe = modal.querySelector('iframe');
            if (iframe) iframe.src = ""; // Limpa iframe para parar vídeos, etc.
            
            // Só remove a classe do body se não houver outros modais abertos.
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        // Ignora o botão do modal do Instagram, que é tratado em seu próprio script.
        const modal = btn.closest('.modal-overlay');
        if (modal && modal.id !== 'instagram-modal') {
             btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay')));
        }
    });
    
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const fadeElements = document.querySelectorAll('.fade-in');
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