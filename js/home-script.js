document.addEventListener('DOMContentLoaded', () => {

    // --- 0. LÓGICA DO CALENDÁRIO ---
    const specificEvents = {
        "2025-04-13": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-04-27": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-05-18": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-05-25": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-06-01": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-06-08": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-06-15": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-06-22": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-06-29": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
        "2025-07-06": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
    };

    function generateRecurringEvents(year) {
        const recurringEvents = {};
        const addEvent = (date, event) => {
            const dateStr = date.toISOString().slice(0, 10);
            if (!recurringEvents[dateStr]) recurringEvents[dateStr] = [];
            recurringEvents[dateStr].push(event);
        };
        const semesterStart = new Date(year, 2, 1), semesterEnd = new Date(year, 6, 0);

        for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, m, d);
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek === 0) { // Domingos
                    addEvent(currentDate, { type: 'culto', time: '10:30', title: 'Culto Matutino' });
                    addEvent(currentDate, { type: 'culto', time: '18:00', title: 'Culto Noturno' });
                }
                if (dayOfWeek === 3) { // Quartas
                    addEvent(currentDate, { type: 'oracao', time: '20:00', title: 'Culto de Oração' });
                }
            }
        }
        return recurringEvents;
    }

    const allEvents = { ...generateRecurringEvents(2025) };
    Object.keys(specificEvents).forEach(date => {
        if (!allEvents[date]) allEvents[date] = [];
        allEvents[date].push(...specificEvents[date]);
    });

    // --- 1. LÓGICA DO MENU HAMBÚRGUER ---
    // ... (código do menu inalterado) ...
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
        document.body.classList.toggle('modal-open');
    });

    // --- 2. LÓGICA DOS MODAIS ---
    const infoModal = document.getElementById('info-modal');
    const calendarModal = document.getElementById('calendar-modal');

    function openAnyModal(modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
    function closeAnyModal(modal) { modal.classList.remove('active'); if (!navLinks.classList.contains('active')) document.body.classList.remove('modal-open'); }
    
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', e => closeAnyModal(e.target.closest('.modal-overlay'))));

    // Lógica para os cards de ministérios e missões
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalTitle = infoModal.querySelector('#modal-title');
            const modalDesc = infoModal.querySelector('#modal-description');
            const modalImg = infoModal.querySelector('#modal-image');
            // MUDANÇA AQUI: Referência ao container do botão
            const modalLinkContainer = infoModal.querySelector('#modal-link-container');

            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent = card.dataset.description;

            if (card.dataset.image) {
                modalImg.src = card.dataset.image;
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none';
            }
            
            // MUDANÇA AQUI: Limpa o container e adiciona o botão se os dados existirem
            modalLinkContainer.innerHTML = ''; // Limpa botões antigos
            if (card.dataset.linkUrl && card.dataset.linkText) {
                const linkButton = document.createElement('a');
                linkButton.href = card.dataset.linkUrl;
                linkButton.textContent = card.dataset.linkText;
                linkButton.className = 'modal-action-button';
                modalLinkContainer.appendChild(linkButton);
            }
            
            openAnyModal(infoModal);
        });
    });

    // --- (Restante do código JS inalterado: widget de eventos, calendário, scroll, etc.) ---
    // --- 3. LÓGICA DO WIDGET DE PRÓXIMOS EVENTOS ---
    function populateNextEvents() {
        const listContainer = document.getElementById('next-events-list');
        if (!listContainer) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureEvents = Object.entries(allEvents)
            .filter(([dateStr]) => new Date(dateStr + 'T00:00:00') >= today)
            .flatMap(([dateStr, events]) => events.map(event => ({ ...event, date: new Date(dateStr + 'T00:00:00') })))
            .sort((a, b) => a.date - b.date);

        const next4Events = futureEvents.slice(0, 4);
        
        if(next4Events.length === 0) {
            listContainer.innerHTML = '<p>Nenhum evento agendado em breve.</p>';
            return;
        }

        listContainer.innerHTML = next4Events.map(event => {
            const day = event.date.getDate();
            const month = event.date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            return `
                <div class="event-item-widget">
                    <div class="date">
                        <span>${String(day).padStart(2, '0')}</span>
                        <small>${month}</small>
                    </div>
                    <div class="info">
                        <strong>${event.title}</strong>
                        <span>${event.time}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    populateNextEvents();

    // --- 4. LÓGICA DO CALENDÁRIO COMPLETO (MODAL) ---
    document.getElementById('open-calendar-btn').addEventListener('click', () => {
        currentDateCalendar = new Date();
        renderCalendar();
        openAnyModal(calendarModal);
    });

    let currentDateCalendar = new Date();
    const monthYearEl = document.getElementById('month-year'),
          calendarDaysEl = document.getElementById('calendar-days'),
          eventDetailsEl = document.getElementById('event-details'),
          eventDetailsTitle = document.getElementById('event-details-title');

    const eventIcons = { ebd: 'fa-solid fa-book-open', culto: 'fa-solid fa-cross', curso: 'fa-solid fa-graduation-cap', oracao: 'fa-solid fa-hands-praying', evento: 'fa-solid fa-star' };

    function renderCalendar() {
        const month = currentDateCalendar.getMonth(), year = currentDateCalendar.getFullYear();
        monthYearEl.textContent = `${currentDateCalendar.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
        calendarDaysEl.innerHTML = '';
        
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const prevLastDate = new Date(year, month, 0).getDate();

        for (let i = firstDay; i > 0; i--) calendarDaysEl.innerHTML += `<div class="day-cell prev-next-month-day">${prevLastDate - i + 1}</div>`;
        
        for (let i = 1; i <= lastDate; i++) {
            const today = new Date();
            let classes = 'day-cell';
            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) classes += ' current-day';
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (allEvents[dateStr]) classes += ' event-day';
            
            const dayCell = document.createElement('div');
            dayCell.className = classes;
            dayCell.textContent = i;
            dayCell.onclick = () => showEventsForDate(dateStr, dayCell);
            calendarDaysEl.appendChild(dayCell);
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

    function showEventsForDate(dateStr, cell) {
        document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
        cell.classList.add('selected-day');

        const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
        eventDetailsTitle.textContent = `Eventos de ${formattedDate}`;
        const events = allEvents[dateStr];
        if (events && events.length > 0) {
            eventDetailsEl.innerHTML = events.sort((a,b) => a.time.localeCompare(b.time)).map(event => `
                <div class="event-item">
                    <div class="event-icon"><i class="${eventIcons[event.type] || 'fa-solid fa-calendar-day'}"></i></div>
                    <div class="event-info">
                        <strong>${event.title}</strong>
                        <span>${event.time}</span>
                    </div>
                </div>`).join('');
        } else {
            eventDetailsEl.innerHTML = '<p>Nenhum evento agendado para este dia.</p>';
        }
    }

    document.getElementById('prev-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() - 1); renderCalendar(); });
    document.getElementById('next-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() + 1); renderCalendar(); });

    // --- 5. BOTÃO VOLTAR AO TOPO & ANIMAÇÃO DE SCROLL ---
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');
    
    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    
    const observerFadeIn = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observerFadeIn.observe(el));
});