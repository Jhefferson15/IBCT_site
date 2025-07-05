// --- SCRIPT PARA A PÁGINA HOME (hodos_home.html) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA COMPARTILHADA (Pode ser usada em várias páginas) ---

    // 1. Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
        // Fecha o menu se clicar fora
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    }

    // 2. Funções de Modal Genéricas (Apenas external para a Home)
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
            if (iframe) iframe.src = ""; // Limpa o iframe ao fechar
            // Verifica se não há outros modais abertos antes de remover a classe do body
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay')));
    });
    
    // 3. Botão "Scroll to Top"
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
    
    // 4. Efeito de "Fade-in" ao rolar a página
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


    // --- LÓGICA ESPECÍFICA DA PÁGINA HOME ---

    // 1. Dados e Conteúdo dos Eventos
    const logoAnimadoHTML = `
        <div style="font-family: 'Montserrat', sans-serif; color: #91452b; display: grid; place-items: center; height: 100%;">
            <style>
                @keyframes float_card { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
                @keyframes shadow_float_card { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; } 50% { transform: translateX(-50%) scale(0.85); opacity: 0.6; } }
                @keyframes pulse_card { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
                .logo-icon_card { position: relative; width: 65px; }
                .logo-icon_card svg { animation: float_card 2.5s ease-in-out infinite; }
                .logo-icon_card::after { content: ''; position: absolute; bottom: -8px; left: 50%; width: 70%; height: 8px; background: rgba(145, 69, 43, 0.15); border-radius: 50%; filter: blur(4px); transform: translateX(-50%); z-index: -1; animation: shadow_float_card 2.5s ease-in-out infinite; }
            </style>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="logo-icon_card">
                    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                        <defs><clipPath id="pin-shape-card"><path d="M 50 120 C 40 110, 5 75, 5 55 A 45 45 0 1 1 95 55 C 95 75, 60 110, 50 120 Z" /></clipPath></defs>
                        <g><path fill="#91452b" d="M 50 120 C 40 110, 5 75, 5 55 A 45 45 0 1 1 95 55 C 95 75, 60 110, 50 120 Z" /><g clip-path="url(#pin-shape-card)"><line stroke="#fdf6ec" stroke-linecap="round" stroke-width="10.5" x1="-18" y1="11" x2="120" y2="77" /><line stroke="#fdf6ec" stroke-linecap="round" stroke-width="10.5" x1="-20" y1="59" x2="98" y2="79" /><circle fill="#fdf6ec" cx="50" cy="55" r="26" /></g></g>
                    </svg>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span style="text-transform: uppercase; line-height: 1; font-size: 2.5rem; font-weight: 700; letter-spacing: -0.05em; animation: pulse_card 0.8s infinite;">HODOS</span>
                    <span style="text-transform: uppercase; line-height: 1; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.25em; margin-top: 2px;">JUVENTUDE</span>
                </div>
            </div>
        </div>
    `;

    const eventsData = [
        { date: '12 de Abril, 2025', category: 'LOUVOR', title: 'Hodos Meet', location: 'IBCT', description: 'Um ambiente jovem de louvor, adoração e palavra. Uma oportunidade para nos reunirmos como um grande grupo para cultuar a Deus com intensidade e alegria.' },
        { date: '07 de Maio, 2025', category: 'ESPECIAL', title: 'Cinema: The Chosen', location: 'ParkShopping', description: 'Encontro descontraído do grupo para assistir à série The Chosen no cinema, fortalecendo a amizade e a comunhão.' },
        { date: '24 de Maio, 2025', category: 'COMUNHÃO', title: 'Hodos Day', location: 'Sítio Campo Maior', description: 'Um dia inteiro de diversão, churrasco e comunhão profunda! Um tempo precioso para fortalecer laços e criar memórias.' },
        { date: '07 de Junho, 2025', category: 'LOUVOR', title: 'Hodos Meet', location: 'IBCT', description: 'Mais um encontro para adorarmos juntos. Traga um amigo e venha cultuar conosco!' },
        { date: '14 de Junho, 2025', category: 'ESPECIAL', title: 'Hodos In Love', location: 'IBCT', description: 'Uma noite especial com tema de Dia dos Namorados para celebrar o amor de forma cristã, seja entre casais ou entre amigos.' },
        { date: '18 de Junho, 2025', category: 'MISSÕES', title: 'Evangelismo com CRU', location: 'Parque de Águas Claras', description: 'Nos unimos aos missionários da CRU para um tempo de evangelismo e serviço a Deus em nossa cidade, compartilhando as boas novas.' },
        { date: 'Semanalmente', category: 'PGM', title: 'PGMs Semanais', location: 'IBCT e Lares', description: 'Nossos Pequenos Grupos de Multiplicação acontecem toda sexta! Temos PGMs para jovens, casais, \'Sis & Bros\' e \'Delas 30+\'. É o nosso principal momento de comunhão e estudo em grupos menores.', recurring: true, externalPage: './eventos/hodos_pgm.html', cardContentHTML: `<iframe src="./tools/logo_pgm.html" style="width:100%; height:100%; border:none; overflow:hidden; background-color: var(--cor-branco);" scrolling="no" title="Animação da logo PGM"></iframe>` },
        { date: 'Agosto de 2025', category: 'ACAMPA', title: 'Hodos Camp 2025', location: 'A definir', description: 'O evento mais esperado do ano! Serão dias de imersão total na Palavra, louvor, dinâmicas e comunhão. O tema deste ano é \'Viva a Verdade\'. Clique para mais detalhes!', externalPage: './eventos/hodos_camp_2025.html', cardContentHTML: logoAnimadoHTML, recurring: true },
        { 
            date: 'Ao primeiro sábado do mês', 
            category: 'MEET', 
            title: 'Hodos Meet', 
            location: 'IBCT', 
            cardClass: 'allow-overflow',
            description: 'O evento mais esperado do ano! Serão dias de imersão total na Palavra, louvor, dinâmicas e comunhão. O tema deste ano é \'Viva a Verdade\'. Clique para mais detalhes!', 
            externalPage: './eventos/hodos_meet.html', 
            
            // --- CONTEÚDO DO CARD ATUALIZADO ---
            cardContentHTML: `
                <div style="position: relative; width: 100%; height: 100%; background-color: white;">
                    <iframe 
                        src="./tools/logo_meet.html" 
                        style="width:100%; height:100%; border:none; overflow:hidden; pointer-events: none;" 
                        scrolling="no" 
                        title="Animação Hodos Meet">
                    </iframe>
                    <div 
                        onclick="abrirPopupParaEvento(this)" 
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; z-index: 5;">
                    </div>
                </div>`,
            recurring: true 
        },
    ];
    
    // 2. Funções de Renderização de Eventos
    let showingFutureEvents = true;

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

    function renderEvents(filter) {
        const lessonsScroller = document.querySelector('.lessons-scroller');
        if (!lessonsScroller) return;
        
        lessonsScroller.innerHTML = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredEvents = eventsData.filter(event => {
            if (event.recurring) return filter === 'future'; // Eventos recorrentes sempre aparecem no "futuro"
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
            if (event.cardClass) {
                card.classList.add(event.cardClass);
            }
            Object.keys(event).forEach(key => { if(event[key] !== undefined && key !== 'cardContentHTML') card.dataset[key] = event[key]; });
            const cardImageContent = event.cardContentHTML || event.category;
            const imageContainerClass = event.cardContentHTML ? "lesson-card-image special-content-container" : "lesson-card-image";
            card.innerHTML = `<div class="${imageContainerClass}">${cardImageContent}</div><div class="lesson-card-content"><div class="date-container"><span class="date-value">${event.date}</span></div><h3>${event.title}</h3></div>`;
            lessonsScroller.appendChild(card);
        });
        addModalListeners();
    }
    
    function addModalListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                if (card.dataset.externalPage) {
                    const externalPageModal = document.getElementById('external-page-modal');
                    const iframe = document.getElementById('modal-iframe');
                    iframe.src = card.dataset.externalPage;
                    openAnyModal(externalPageModal);
                } else {
                    const lessonModal = document.getElementById('lesson-modal');
                    document.getElementById('modal-title').innerText = card.dataset.title;
                    document.querySelector('#modal-location span').innerText = card.dataset.location;
                    document.getElementById('modal-description').innerText = card.dataset.description;
                    openAnyModal(lessonModal);
                }
            });
        });
    }

    // 3. Lógica da Seção de Eventos (Botões, etc)
    const lessonsScroller = document.querySelector('.lessons-scroller');
    if (lessonsScroller) {
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
        
        renderEvents('future'); // Renderização inicial
    }

    // 4. Lógica do Feed do Instagram
    const instaScroller = document.querySelector('.instagram-scroller');
    if (instaScroller) {
        const prevInstaBtn = document.getElementById('prev-insta-btn');
        const nextInstaBtn = document.getElementById('next-insta-btn');
        prevInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: -300, behavior: 'smooth' }));
        nextInstaBtn.addEventListener('click', () => instaScroller.scrollBy({ left: 300, behavior: 'smooth' }));
    }
    
    // 5. Lógica do Calendário (se presente na página)
    function generateCalendarEvents() {
        const calendarEvents = {};
        eventsData.forEach(event => {
            const eventDate = parseDate(event.date);
            if (eventDate) {
                const dateStr = eventDate.toISOString().slice(0, 10);
                if (!calendarEvents[dateStr]) calendarEvents[dateStr] = [];
                calendarEvents[dateStr].push({ 
                    type: event.category.toLowerCase(), 
                    title: event.title, 
                    location: event.location
                });
            }
        });
        return calendarEvents;
    }
    window.CALENDAR_EVENTS = generateCalendarEvents();

});