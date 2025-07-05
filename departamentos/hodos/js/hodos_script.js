// --- SCRIPT PARA A PÁGINA HODOS (hodos_home.html) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTILHADA (Pode ser usada em várias páginas) ---
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

    // 1. Dados e Conteúdo dos Eventos
    const eventsData = [
        { date: '12 de Abril, 2025', category: 'LOUVOR', title: 'Hodos Meet', location: 'IBCT', description: 'Um ambiente jovem de louvor, adoração e palavra. Uma oportunidade para nos reunirmos como um grande grupo para cultuar a Deus com intensidade e alegria.' },
        { date: '07 de Maio, 2025', category: 'ESPECIAL', title: 'Cinema: The Chosen', location: 'ParkShopping', description: 'Encontro descontraído do grupo para assistir à série The Chosen no cinema, fortalecendo a amizade e a comunhão.' },
        { date: '24 de Maio, 2025', category: 'COMUNHÃO', title: 'Hodos Day', location: 'Sítio Campo Maior', description: 'Um dia inteiro de diversão, churrasco e comunhão profunda! Um tempo precioso para fortalecer laços e criar memórias.' },
        { date: '07 de Junho, 2025', category: 'LOUVOR', title: 'Hodos Meet', location: 'IBCT', description: 'Mais um encontro para adorarmos juntos. Traga um amigo e venha cultuar conosco!' },
        { date: '14 de Junho, 2025', category: 'ESPECIAL', title: 'Hodos In Love', location: 'IBCT', description: 'Uma noite especial com tema de Dia dos Namorados para celebrar o amor de forma cristã, seja entre casais ou entre amigos.' },
        { date: '18 de Junho, 2025', category: 'MISSÕES', title: 'Evangelismo com CRU', location: 'Parque de Águas Claras', description: 'Nos unimos aos missionários da CRU para um tempo de evangelismo e serviço a Deus em nossa cidade, compartilhando as boas novas.' },
        { date: 'Semanalmente', category: 'PGM', title: 'PGMs Semanais', location: 'IBCT e Lares', description: 'Nossos Pequenos Grupos de Multiplicação acontecem toda sexta! Temos PGMs para jovens, casais, \'Sis & Bros\' e \'Delas 30+\'. É o nosso principal momento de comunhão e estudo em grupos menores.', recurring: true, externalPage: './eventos/hodos_pgm.html', cardContentHTML: `<iframe src="./tools/logo_pgm.html" style="width:100%; height:100%; border:none; overflow:hidden; background-color: var(--cor-branco);" scrolling="no" title="Animação da logo PGM"></iframe>` },
        { date: 'Agosto de 2025', category: 'ACAMPA', title: 'Hodos Camp 2025', location: 'A definir', description: 'O evento mais esperado do ano! Serão dias de imersão total na Palavra, louvor, dinâmicas e comunhão. O tema deste ano é \'Viva a Verdade\'. Clique para mais detalhes!', externalPage: './eventos/hodos_camp_2025.html', recurring: true },
        { date: 'Ao primeiro sábado do mês', category: 'MEET', title: 'Hodos Meet', location: 'IBCT', cardClass: 'allow-overflow', description: 'Nosso encontro mensal de adoração e Palavra. Uma noite para recarregar as energias e se conectar com Deus e com os irmãos.', externalPage: './eventos/hodos_meet.html', cardContentHTML: `<div style="position: relative; width: 100%; height: 100%; background-color: white;"><iframe src="./tools/logo_meet.html" style="width:100%; height:100%; border:none; overflow:hidden; pointer-events: none;" scrolling="no" title="Animação Hodos Meet"></iframe><div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; z-index: 5;"></div></div>`, recurring: true },
    ];
    
    function parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return null;
        const monthMap = { 'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11 };
        const parts = dateString.toLowerCase().replace(',', '').split(' ');
        if (parts.length === 3 && parts[0].match(/^\d+$/)) {
             const day = parseInt(parts[0], 10), month = monthMap[parts[1]], year = parseInt(parts[2], 10);
             return (!isNaN(day) && month !== undefined && !isNaN(year)) ? new Date(year, month, day) : null;
        } else if (parts.length === 3 && monthMap[parts[0]] !== undefined) {
            const month = monthMap[parts[0]], year = parseInt(parts[2], 10);
            return (month !== undefined && !isNaN(year)) ? new Date(year, month, 1) : null;
        }
        return null;
    }
    
    // 2. Renderização dos Cards de Eventos (Carrossel Principal)
    let showingFutureEvents = true;
    function renderEvents(filter) {
        const lessonsScroller = document.querySelector('.lessons-scroller');
        if (!lessonsScroller) return;
        lessonsScroller.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredEvents = eventsData.filter(event => {
            if (event.recurring) return filter === 'future';
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
            Object.keys(event).forEach(key => { if(event[key] !== undefined && key !== 'cardContentHTML') card.dataset[key] = event[key]; });
            const cardImageContent = event.cardContentHTML || event.category;
            const imageContainerClass = event.cardContentHTML ? "lesson-card-image special-content-container" : "lesson-card-image";
            card.innerHTML = `<div class="${imageContainerClass}">${cardImageContent}</div><div class="lesson-card-content"><span class="date-value">${event.date}</span><h3>${event.title}</h3></div>`;
            lessonsScroller.appendChild(card);
        });
        addModalListeners();
    }
    
    function addModalListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            if(card.querySelector('.special-content-container')) {
                card.querySelector('.special-content-container + .lesson-card-content').addEventListener('click', () => openEventModal(card.dataset));
                const clickableOverlay = card.querySelector('[style*="cursor: pointer"]');
                if (clickableOverlay) {
                    clickableOverlay.addEventListener('click', () => openEventModal(card.dataset));
                }
            } else {
                 card.addEventListener('click', () => openEventModal(card.dataset));
            }
        });
    }

    function openEventModal(dataset) {
        if (dataset.externalPage) {
            const externalPageModal = document.getElementById('external-page-modal');
            const iframe = document.getElementById('modal-iframe');
            iframe.src = dataset.externalPage;
            openAnyModal(externalPageModal);
        } else {
            const lessonModal = document.getElementById('lesson-modal');
            document.getElementById('modal-title').innerText = dataset.title;
            document.querySelector('#modal-location span').innerText = dataset.location;
            document.getElementById('modal-description').innerText = dataset.description;
            openAnyModal(lessonModal);
        }
    }

    // 3. Lógica do Carrossel de Eventos Principal
    const lessonsWrapper = document.querySelector('.lessons-wrapper');
    if (lessonsWrapper) {
        const lessonsScroller = lessonsWrapper.querySelector('.lessons-scroller');
        const toggleBtn = document.getElementById('toggle-events-btn');
        const eventsTitle = document.getElementById('events-title');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        toggleBtn.addEventListener('click', () => {
            showingFutureEvents = !showingFutureEvents;
            eventsTitle.textContent = showingFutureEvents ? 'Nossos Próximos Encontros' : 'Eventos que já Aconteceram';
            toggleBtn.textContent = showingFutureEvents ? 'Ver Eventos Passados' : 'Ver Próximos Eventos';
            renderEvents(showingFutureEvents ? 'future' : 'past');
        });

        prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -330, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: 330, behavior: 'smooth' }));
        
        renderEvents('future');
    }

    // 4. Lógica do Carrossel do Instagram (agora único)
    const instaScroller = document.querySelector('.instagram-scroller');
    if (instaScroller) {
        const prevInstaBtn = document.getElementById('prev-insta-btn');
        const nextInstaBtn = document.getElementById('next-insta-btn');
        
        // MUDANÇA: O valor do scroll precisa ser maior para mover um "bloco" de colunas
        const scrollAmount = 280 + 20; // Largura do card + gap
        
        prevInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }
    
    // 5. Lógica para popular o WIDGET de próximos eventos
    function populateNextHodosEvents() {
        const listContainer = document.getElementById('next-events-list');
        if (!listContainer) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureEvents = eventsData
            .filter(event => !event.recurring)
            .map(event => ({ ...event, dateObj: parseDate(event.date) }))
            .filter(event => event.dateObj && event.dateObj >= today)
            .sort((a, b) => a.dateObj - b.dateObj);

        const next4Events = futureEvents.slice(0, 4);

        if(next4Events.length === 0) {
            listContainer.innerHTML = '<p>Nenhum evento agendado em breve.</p>';
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
    populateNextHodosEvents();

    // 6. Lógica para alimentar o CALENDÁRIO COMPLETO (Modal)
    function generateCalendarEvents() {
        const calendarEvents = {};
        eventsData.forEach(event => {
            if (event.recurring) return;
            const eventDate = parseDate(event.date);
            if (eventDate) {
                const dateStr = eventDate.toISOString().slice(0, 10);
                if (!calendarEvents[dateStr]) calendarEvents[dateStr] = [];
                calendarEvents[dateStr].push({ 
                    type: event.category.toLowerCase().replace('ã', 'a'),
                    title: event.title, 
                    location: event.location,
                    time: 'Verificar'
                });
            }
        });
        return calendarEvents;
    }
    window.CALENDAR_EVENTS = generateCalendarEvents();

});