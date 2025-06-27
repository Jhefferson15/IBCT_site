document.addEventListener('DOMContentLoaded', () => {
    /* 
    AVISO: A lógica da animação da logo foi intencionalmente removida deste arquivo.
    Ela agora é carregada de forma isolada através do `<iframe>` no arquivo HTML,
    o que torna este script mais leve, rápido e focado apenas na interatividade da página.
    */

    // --- 1. MANIPULAÇÃO DE ELEMENTOS DO DOM (DECLARADOS NO INÍCIO) ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const infoModal = document.getElementById('info-modal');
    // MUDANÇA: Remoção da variável do modal do calendário
    // const calendarModal = document.getElementById('calendar-modal');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    const fadeElements = document.querySelectorAll('.fade-in');

    // --- 2. BASE DE DADOS DO CALENDÁRIO ---
    const specificEvents = {
        "2025-04-13": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-04-27": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-05-18": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-05-25": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-01": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-08": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-15": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-22": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-06-29": [{ type: 'ebd', time: '09:00', title: 'EBD' }], "2025-07-06": [{ type: 'ebd', time: '09:00', title: 'EBD' }],
    };
    function generateRecurringEvents(year) {
        const recurringEvents = {};
        const addEvent = (date, event) => {
            const dateStr = date.toISOString().slice(0, 10);
            if (!recurringEvents[dateStr]) recurringEvents[dateStr] = [];
            recurringEvents[dateStr].push(event);
        };
        for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, m, d);
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek === 0) { addEvent(currentDate, { type: 'culto', time: '10:30', title: 'Culto Matutino' }); addEvent(currentDate, { type: 'culto', time: '18:00', title: 'Culto Noturno' }); }
                if (dayOfWeek === 3) { addEvent(currentDate, { type: 'oracao', time: '20:00', title: 'Culto de Oração' }); }
            }
        }
        return recurringEvents;
    }
    const allEvents = { ...generateRecurringEvents(2025) };
    Object.keys(specificEvents).forEach(date => {
        if (!allEvents[date]) allEvents[date] = [];
        allEvents[date].push(...specificEvents[date]);
    });

    // MUDANÇA: Expondo os dados de eventos para o componente de calendário global.
    window.CALENDAR_EVENTS = allEvents;

    // --- 3. LÓGICA DO MENU HAMBÚRGUER ---
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            document.body.classList.toggle('modal-open', navLinks.classList.contains('active'));
        });
    }

    // --- 4. LÓGICA DOS MODAIS ---
    function openAnyModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }
    function closeAnyModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            if (!navLinks.classList.contains('active')) {
                document.body.classList.remove('modal-open');
            }
        }
    }
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', e => closeAnyModal(e.target.closest('.modal-overlay')));
    });

    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('click', () => {
            const modalTitle = infoModal.querySelector('#modal-title');
            const modalDesc = infoModal.querySelector('#modal-description');
            const modalImg = infoModal.querySelector('#modal-image');
            const modalLinkContainer = infoModal.querySelector('#modal-link-container');

            modalTitle.textContent = card.dataset.title;
            modalDesc.textContent = card.dataset.description;
            
            modalImg.style.display = card.dataset.image ? 'block' : 'none';
            if (card.dataset.image) modalImg.src = card.dataset.image;
            
            modalLinkContainer.innerHTML = '';
            
            if (card.dataset.link2Url && card.dataset.link2Text) {
                const linkButton2 = document.createElement('a');
                linkButton2.href = card.dataset.link2Url;
                linkButton2.textContent = card.dataset.link2Text;
                linkButton2.className = 'modal-action-button';
                modalLinkContainer.appendChild(linkButton2);
            }
            
            if (card.dataset.linkUrl && card.dataset.linkText) {
                const linkButton = document.createElement('a');
                linkButton.href = card.dataset.linkUrl;
                linkButton.textContent = card.dataset.linkText;
                linkButton.className = 'modal-action-button discreet';
                modalLinkContainer.appendChild(linkButton);
            }
            
            openAnyModal(infoModal);
        });
    });

    // --- 5. LÓGICA DO WIDGET DE PRÓXIMOS EVENTOS ---
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
            const day = String(event.date.getDate()).padStart(2, '0');
            const month = event.date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
            return `
                <div class="event-item-widget">
                    <div class="date">
                        <span>${day}</span>
                        <small>${month}</small>
                    </div>
                    <div class="info">
                        <strong>${event.title}</strong>
                        <span>${event.time}</span>
                    </div>
                </div>`;
        }).join('');
    }
    populateNextEvents();

    // --- 6. MUDANÇA: LÓGICA DO CALENDÁRIO COMPLETO (MODAL) REMOVIDA ---
    // Toda a lógica que estava aqui (renderCalendar, showEventsForDate, listeners dos botões, etc.)
    // foi movida para o componente 'componentes/calendario/calendario.js'.

    // --- 7. BOTÃO VOLTAR AO TOPO & ANIMAÇÃO DE SCROLL ---
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        });
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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