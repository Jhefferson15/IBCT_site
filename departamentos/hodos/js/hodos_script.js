// --- START OF FILE departamentos/hodos/js/hodos_script.js ---

// MUDANÇA: Toda a lógica agora está dentro de um listener que espera a API do calendário ficar pronta.
// Isso garante que `window.IBCT_EVENTS_API` exista antes de tentarmos usá-la.
document.addEventListener('ibct-api-ready', () => {

    // --- LÓGICA COMPARTILHADA (Menu, Modais, Scroll, Fade) ---
    // Esta parte pode ser reutilizada em outras páginas do site.

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
            if (iframe) iframe.src = ""; // Limpa o iframe para parar vídeos/animações
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay')));
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


    // --- LÓGICA ESPECÍFICA DA PÁGINA HODOS ---
    
    // O array de dados de eventos foi removido daqui e centralizado no `calendario.js`.

    // Função auxiliar para converter datas do formato 'AAAA-MM-DD' para objetos Date.
    function parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string' || !dateString.includes('-')) return null;
        return new Date(dateString + "T00:00:00"); // Adiciona o T00:00 para evitar problemas de fuso horário
    }
    
    // Controla se o carrossel mostra eventos futuros ou passados.
    let showingFutureEvents = true;

    function renderEventsCarousel(filter) {
        const lessonsScroller = document.querySelector('.lessons-scroller');
        if (!lessonsScroller) return;

        lessonsScroller.innerHTML = '';
        
        // Pega os eventos da API central, filtrando para o departamento 'hodos' e que devem aparecer no 'carousel'.
        const allHodosEvents = window.IBCT_EVENTS_API.getEvents({ filter: 'hodos', displayIn: 'carousel' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const filteredEvents = allHodosEvents.filter(event => {
            if (event.recurring) return filter === 'future'; // Eventos recorrentes sempre aparecem em "futuros".
            const eventDate = parseDate(event.date);
            if (!eventDate) return false;
            return filter === 'future' ? eventDate >= today : eventDate < today;
        });

        if (filteredEvents.length === 0) {
            lessonsScroller.innerHTML = `<p style="padding: 20px; text-align: center; width: 100%;">Nenhum evento ${filter === 'future' ? 'futuro' : 'passado'} encontrado.</p>`;
            return;
        }

        filteredEvents.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            if (event.cardClass) card.classList.add(event.cardClass);
            
            // Transfere todas as propriedades do evento para data-attributes no elemento do card.
            Object.keys(event).forEach(key => {
                 if(event[key] !== undefined && typeof event[key] !== 'object') {
                    card.dataset[key] = event[key];
                 }
            });

            const cardImageContent = event.cardContentHTML || event.type.toUpperCase();
            const imageContainerClass = event.cardContentHTML ? "lesson-card-image special-content-container" : "lesson-card-image";
            card.innerHTML = `<div class="${imageContainerClass}">${cardImageContent}</div><div class="lesson-card-content"><span class="date-value">${event.date}</span><h3>${event.title}</h3></div>`;
            lessonsScroller.appendChild(card);
        });
        addModalListeners();
    }
    
    function addModalListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            if (card.dataset.externalPage) {
                // Se tiver uma página externa, o clique abre o modal com iframe.
                card.addEventListener('click', () => openEventModal(card.dataset));
            } else {
                 // Senão, abre o modal de informações simples.
                 // (Implementação do modal simples não está aqui, mas o gancho está pronto).
            }
        });
    }

    function openEventModal(dataset) {
        if (dataset.externalPage) {
            const externalPageModal = document.getElementById('external-page-modal');
            const iframe = document.getElementById('modal-iframe');
            if(externalPageModal && iframe) {
                iframe.src = dataset.externalPage;
                openAnyModal(externalPageModal);
            }
        } 
        // Você pode adicionar um `else` aqui para lidar com modais simples se precisar.
    }

    // --- Inicialização e Listeners dos Componentes da Página ---

    // 1. Carrossel de Eventos Principal
    const lessonsWrapper = document.querySelector('.lessons-wrapper');
    if (lessonsWrapper) {
        const toggleBtn = document.getElementById('toggle-events-btn');
        const eventsTitle = document.getElementById('events-title');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const scroller = lessonsWrapper.querySelector('.lessons-scroller');

        toggleBtn.addEventListener('click', () => {
            showingFutureEvents = !showingFutureEvents;
            eventsTitle.textContent = showingFutureEvents ? 'Nossos Próximos Encontros' : 'Eventos que já Aconteceram';
            toggleBtn.textContent = showingFutureEvents ? 'Ver Eventos Passados' : 'Ver Próximos Eventos';
            renderEventsCarousel(showingFutureEvents ? 'future' : 'past');
        });

        prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -330, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => scroller.scrollBy({ left: 330, behavior: 'smooth' }));
        
        renderEventsCarousel('future'); // Renderiza o carrossel pela primeira vez.
    }

    // 2. Carrossel do Instagram
    const instaScroller = document.querySelector('.instagram-scroller');
    if (instaScroller) {
        const prevInstaBtn = document.getElementById('prev-insta-btn');
        const nextInstaBtn = document.getElementById('next-insta-btn');
        const scrollAmount = 280 + 20; // Largura do card + gap
        
        prevInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }
    
    // 3. Widget de Próximos Eventos
    function populateNextHodosEvents() {
        const listContainer = document.getElementById('next-events-list');
        if (!listContainer) return;

        // Pede eventos do 'hodos' que devem ser exibidos no 'widget'.
        const hodosWidgetEvents = window.IBCT_EVENTS_API.getEvents({ filter: 'hodos', displayIn: 'widget' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureEvents = hodosWidgetEvents
            .map(event => ({ ...event, dateObj: parseDate(event.date) }))
            .filter(event => event.dateObj && event.dateObj >= today)
            .sort((a, b) => a.dateObj - b.dateObj);

        const next4Events = futureEvents.slice(0, 4);

        if(next4Events.length === 0) {
            listContainer.innerHTML = '<p>Nenhum evento do Hodos agendado em breve.</p>';
            return;
        }

        listContainer.innerHTML = next4Events.map(event => {
            const day = String(event.dateObj.getDate()).padStart(2, '0');
            const month = event.dateObj.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            return `
                <div class="event-item-widget">
                    <div class="date">
                        <span>${day}</span>
                        <small>${month}</small>
                    </div>
                    <div class="info">
                        <strong>${event.title}</strong>
                        <span>${event.location}</span>
                    </div>
                </div>`;
        }).join('');
    }
    populateNextHodosEvents(); // Popula o widget de eventos.

}); // Fim do listener 'ibct-api-ready'