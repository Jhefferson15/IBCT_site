document.addEventListener('DOMContentLoaded', () => {

    // --- ARTE HTML DO ACAMPAMENTO ---
    // Injetar o HTML diretamente evita problemas de segurança do navegador ao carregar arquivos locais.
    // As classes e keyframes foram renomeados (ex: float_card) para evitar conflitos de CSS global.
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


    // --- BASE DE DADOS DOS EVENTOS ---
    const eventsData = [
        { date: '12 de Abril, 2025', category: 'LOUVOR', title: 'Hodos Meet', location: 'IBCT', description: 'Um ambiente jovem de louvor, adoração e palavra. Uma oportunidade para nos reunirmos como um grande grupo para cultuar a Deus com intensidade e alegria.' },
        { date: '07 de Maio, 2025', category: 'ESPECIAL', title: 'Cinema: The Chosen', location: 'ParkShopping', description: 'Encontro descontraído do grupo para assistir à série The Chosen no cinema, fortalecendo a amizade e a comunhão.' },
        { date: '24 de Maio, 2025', category: 'COMUNHÃO', title: 'Hodos Day', location: 'Sítio Campo Maior', description: 'Um dia inteiro de diversão, churrasco e comunhão profunda! Um tempo precioso para fortalecer laços e criar memórias.' },
        { date: '07 de Junho, 2025', category: 'LOUVOR', title: 'Hodos Meet', location: 'IBCT', description: 'Mais um encontro para adorarmos juntos. Traga um amigo e venha cultuar conosco!' },
        { date: '14 de Junho, 2025', category: 'ESPECIAL', title: 'Hodos In Love', location: 'IBCT', description: 'Uma noite especial com tema de Dia dos Namorados para celebrar o amor de forma cristã, seja entre casais ou entre amigos.' },
        { date: '18 de Junho, 2025', category: 'MISSÕES', title: 'Evangelismo com CRU', location: 'Parque de Águas Claras', description: 'Nos unimos aos missionários da CRU para um tempo de evangelismo e serviço a Deus em nossa cidade, compartilhando as boas novas.' },
        { date: 'Sextas-feiras', category: 'PGM', title: 'PGMs Semanais', location: 'IBCT e Lares', description: 'Nossos Pequenos Grupos de Multiplicação acontecem toda sexta! Temos PGMs para jovens, casais, \'Sis & Bros\' e \'Delas 30+\'. É o nosso principal momento de comunhão e estudo em grupos menores.', recurring: true },
        // Alterado: 'cardContentHTML' agora contém a arte animada para exibição no card.
        { date: 'Agosto de 2025', category: 'ACAMPA', title: 'Hodos Camp 2025', location: 'A definir', description: 'O evento mais esperado do ano! Serão dias de imersão total na Palavra, louvor, dinâmicas e comunhão. O tema deste ano é \'Viva a Verdade\'. Clique para mais detalhes!',
          externalPage: './eventos/hodos_camp_2025.html', // Mantido para o popup (precisa de servidor)
          cardContentHTML: logoAnimadoHTML, // Novo: HTML para o card
          recurring: true },
    ];

    // --- ELEMENTOS DO DOM ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const lessonsScroller = document.querySelector('.lessons-scroller');
    const toggleBtn = document.getElementById('toggle-events-btn');
    const eventsTitle = document.getElementById('events-title');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let showingFutureEvents = true;

    // --- FUNÇÕES ---

    function parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string') return null;
        const monthMap = { 'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3, 'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7, 'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11 };
        const parts = dateString.toLowerCase().replace(',', '').split(' ');
        if (parts.length < 3) return null;
        const day = parseInt(parts[0], 10), month = monthMap[parts[1]], year = parseInt(parts[2], 10);
        return (!isNaN(day) && month !== undefined && !isNaN(year)) ? new Date(year, month, day) : null;
    }

    function renderEvents(filter) {
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
            // Adiciona todos os dados necessários ao dataset do card, excluindo o HTML da arte
            Object.keys(event).forEach(key => {
                if(event[key] !== undefined && key !== 'cardContentHTML') card.dataset[key] = event[key];
            });

            // Condicional para renderizar o HTML customizado ou a categoria
            const cardImageContent = event.cardContentHTML || event.category;

            // Define a classe do container da imagem
            const imageContainerClass = event.cardContentHTML
                ? "lesson-card-image special-content-container"
                : "lesson-card-image";

            card.innerHTML = `
                <div class="${imageContainerClass}">
                    ${cardImageContent}
                </div>
                <div class="lesson-card-content">
                    <div class="date-container">
                        <span class="date-value">${event.date}</span>
                    </div>
                    <h3>${event.title}</h3>
                </div>
            `;
            lessonsScroller.appendChild(card);
        });

        addModalListeners();
    }
    
    // addModalListeners agora abre o modal correto
    function addModalListeners() {
        document.querySelectorAll('.event-card').forEach(card => {
            card.addEventListener('click', () => {
                // Se o card tiver um link para uma página externa (para o pop-up)
                if (card.dataset.externalPage) {
                    const externalPageModal = document.getElementById('external-page-modal');
                    const iframe = document.getElementById('modal-iframe');
                    iframe.src = card.dataset.externalPage; // Define o src do iframe do modal
                    openAnyModal(externalPageModal);
                } else {
                    // Lógica original para o modal de texto
                    const lessonModal = document.getElementById('lesson-modal');
                    document.getElementById('modal-title').innerText = card.dataset.title;
                    document.querySelector('#modal-location span').innerText = card.dataset.location;
                    document.getElementById('modal-description').innerText = card.dataset.description;
                    openAnyModal(lessonModal);
                }
            });
        });
    }

    toggleBtn.addEventListener('click', () => {
        showingFutureEvents = !showingFutureEvents;
        if (showingFutureEvents) {
            eventsTitle.textContent = 'Nossos Próximos Encontros';
            toggleBtn.textContent = 'Ver Eventos Passados';
            renderEvents('future');
        } else {
            eventsTitle.textContent = 'Eventos que já Aconteceram';
            toggleBtn.textContent = 'Ver Próximos Eventos';
            renderEvents('past');
        }
    });

    // --- LÓGICA DO MENU, MODAIS E SCROLL ---
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -330, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: 330, behavior: 'smooth' }));
    
    function openAnyModal(modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
    function closeAnyModal(modal) { 
        modal.classList.remove('active');
        // Limpa o src do iframe ao fechar para parar a animação/vídeo
        const iframe = modal.querySelector('iframe');
        if (iframe) iframe.src = "";
        // Remove a classe do body apenas se nenhum outro modal estiver ativo
        if (!document.querySelector('.modal-overlay.active')) {
            document.body.classList.remove('modal-open');
        }
    }
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay'))));
    
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    window.addEventListener('scroll', () => scrollToTopBtn.classList.toggle('visible', window.scrollY > 300));
    scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerFadeIn = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observerFadeIn.observe(el));

    // --- LÓGICA DO CALENDÁRIO ---
    let currentDateCalendar = new Date();
    const monthYearEl = document.getElementById('month-year'), calendarDaysEl = document.getElementById('calendar-days'), eventDetailsEl = document.getElementById('event-details'), eventDetailsTitle = document.getElementById('event-details-title');
    const eventIcons = { ebd: 'fa-solid fa-book-open', culto: 'fa-solid fa-cross', pgm: 'fa-solid fa-people-group', oracao: 'fa-solid fa-hands-praying', evento: 'fa-solid fa-star', missões: 'fa-solid fa-globe', especial: 'fa-solid fa-gift', acampa: 'fa-solid fa-campground' }; // Adicionado ícone para 'acampa'
    
    // Função para gerar o objeto de eventos para o calendário a partir da base de dados
    function generateCalendarEvents() {
        const calendarEvents = {};
        eventsData.forEach(event => {
            // Incluir eventos recorrentes se tiverem uma data específica para aparecer no calendário
            // Por enquanto, apenas eventos com data única
            if (event.recurring && !parseDate(event.date)) return; 
            
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
    const allCalendarEvents = generateCalendarEvents();

    function renderCalendar() {
        const month = currentDateCalendar.getMonth(), year = currentDateCalendar.getFullYear();
        monthYearEl.textContent = `${currentDateCalendar.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
        calendarDaysEl.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        // Ajuste para não adicionar dias do próximo mês no início
        const prevLastDate = new Date(year, month, 0).getDate();

        // Dias do mês anterior
        for (let i = firstDay; i > 0; i--) calendarDaysEl.innerHTML += `<div class="day-cell prev-next-month-day">${prevLastDate - i + 1}</div>`;
        
        // Dias do mês atual
        for (let i = 1; i <= lastDate; i++) {
            const today = new Date();
            let classes = 'day-cell';
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) classes += ' current-day';
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (allCalendarEvents[dateStr]) classes += ' event-day';
            
            const dayCell = document.createElement('div');
            dayCell.className = classes;
            dayCell.textContent = i;
            dayCell.onclick = () => showCalendarEvents(dateStr, dayCell);
            calendarDaysEl.appendChild(dayCell);
        }

        // Dias do próximo mês (para preencher a última semana)
        const totalCells = firstDay + lastDate;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            calendarDaysEl.innerHTML += `<div class="day-cell prev-next-month-day">${i}</div>`;
        }

        const today = new Date();
        if (month === today.getMonth() && year === today.getFullYear()) {
            const todayCell = calendarDaysEl.querySelector('.current-day');
            if (todayCell) setTimeout(() => todayCell.click(), 100);
        } else {
             eventDetailsTitle.textContent = 'Eventos do Dia';
             eventDetailsEl.innerHTML = '<p>Selecione um dia para ver os eventos.</p>';
        }
    }

    function showCalendarEvents(dateStr, cell) {
        document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
        cell.classList.add('selected-day');
        const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        eventDetailsTitle.textContent = `Eventos de ${formattedDate}`;
        const events = allCalendarEvents[dateStr];
        if (events && events.length > 0) {
            eventDetailsEl.innerHTML = '';
            events.forEach(event => {
                eventDetailsEl.innerHTML += `
                    <div class="event-item">
                        <div class="event-icon"><i class="${eventIcons[event.type] || 'fa-solid fa-calendar-day'}"></i></div>
                        <div class="event-info">
                            <strong>${event.title}</strong>
                            <span>${event.location || 'Local a confirmar'}</span>
                        </div>
                    </div>`;
            });
        } else {
            eventDetailsEl.innerHTML = '<p>Nenhum evento específico agendado para este dia.</p>';
        }
    }

    document.getElementById('prev-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() + 1); renderCalendar(); });
    document.getElementById('open-calendar-link').addEventListener('click', () => { 
        renderCalendar(); // Renderiza o calendário ao abrir o modal
        openAnyModal(document.getElementById('calendar-modal')); 
    });


    // --- INICIALIZAÇÃO ---
    renderEvents('future');

});