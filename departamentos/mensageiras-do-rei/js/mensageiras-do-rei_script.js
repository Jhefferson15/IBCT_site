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
            const iframe = modal.querySelector('iframe');
            if (iframe) iframe.src = "";
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
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

    // --- LÓGICA DE EVENTOS ---
    const eventsScroller = document.querySelector('.lessons-scroller');
    const eventsTitle = document.getElementById('events-title');
    const toggleEventsBtn = document.getElementById('toggle-events-btn');
    const externalPageModal = document.getElementById('external-page-modal');
    const modalIframe = document.getElementById('modal-iframe');
    let allEvents = [];
    let showingPastEvents = true;

    function renderEvents(eventsToRender) {
        if (!eventsScroller) return;
        eventsScroller.innerHTML = '';
        if (eventsToRender.length === 0) {
            eventsScroller.innerHTML = '<p>Nenhum evento encontrado.</p>';
            return;
        }
        eventsToRender.forEach(event => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            card.dataset.pageUrl = event.pageUrl;
            card.innerHTML = `
                <div class="lesson-card-image">
                    <span>${event.date}</span>
                </div>
                <div class="lesson-card-content">
                    <h3>${event.title}</h3>
                    <p>${event.description}</p>
                </div>
            `;
            card.addEventListener('click', () => {
                if (modalIframe && externalPageModal) {
                    modalIframe.src = card.dataset.pageUrl;
                    openAnyModal(externalPageModal);
                }
            });
            eventsScroller.appendChild(card);
        });
    }

    function updateEventsView() {
        if (!toggleEventsBtn || !eventsTitle) return;
        const eventsToDisplay = allEvents.filter(event => event.isPast === showingPastEvents);
        renderEvents(eventsToDisplay);
        
        if (showingPastEvents) {
            eventsTitle.textContent = 'Nossos Eventos Passados';
            toggleEventsBtn.textContent = 'Ver Próximos Eventos';
        } else {
            eventsTitle.textContent = 'Nossos Próximos Encontros';
            toggleEventsBtn.textContent = 'Ver Eventos Passados';
        }
    }

    if (toggleEventsBtn) {
        toggleEventsBtn.addEventListener('click', () => {
            showingPastEvents = !showingPastEvents;
            updateEventsView();
        });
    }

    fetch('js/mr_events.json')
        .then(response => response.json())
        .then(data => {
            allEvents = data;
            // Initially show past events as requested
            showingPastEvents = true;
            updateEventsView();
        })
        .catch(error => {
            console.error('Erro ao carregar eventos:', error);
            if (eventsScroller) {
                eventsScroller.innerHTML = '<p>Não foi possível carregar os eventos.</p>';
            }
        });
});