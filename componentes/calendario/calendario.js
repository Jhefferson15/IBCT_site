document.addEventListener('DOMContentLoaded', async () => {
    // URL para o componente HTML. Ajuste o caminho se a estrutura de pastas for diferente.
    const componentUrl = '/../componentes/calendario/calendario.html';

    // --- 1. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    async function initializeCalendarComponent() {
        try {
            // Carrega o HTML do componente e injeta no body
            const response = await fetch(componentUrl);
            if (!response.ok) throw new Error(`Não foi possível carregar o componente: ${response.statusText}`);
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);

            // Agora que o HTML existe, podemos configurar a lógica
            setupCalendarLogic();

        } catch (error) {
            console.error('Falha ao inicializar o componente de calendário:', error);
        }
    }

    // --- 2. FUNÇÃO PARA CONFIGURAR TODA A LÓGICA ---
    function setupCalendarLogic() {
        // --- Elementos do DOM do Componente ---
        const calendarModal = document.getElementById('calendar-modal-component');
        const closeModalBtn = calendarModal.querySelector('.modal-close-component');
        const monthYearEl = document.getElementById('month-year-component');
        const calendarDaysEl = document.getElementById('calendar-days-component');
        const eventDetailsEl = document.getElementById('event-details-component');
        const eventDetailsTitle = document.getElementById('event-details-title-component');
        const prevMonthBtn = document.getElementById('prev-month-component');
        const nextMonthBtn = document.getElementById('next-month-component');
        const openCalendarTriggers = document.querySelectorAll('[data-action="open-calendar"]');

        if (!calendarModal) return; // Se o modal não foi injetado, para a execução

        // --- Estado e Dados ---
        let currentDate = new Date();
        // A "API" do componente: busca os eventos de uma variável global.
        // Cada página deve definir `window.CALENDAR_EVENTS` antes de este script rodar.
        const allEvents = window.CALENDAR_EVENTS || {};
        const eventIcons = {
            ebd: 'fa-solid fa-book-open',
            culto: 'fa-solid fa-cross',
            curso: 'fa-solid fa-graduation-cap',
            oracao: 'fa-solid fa-hands-praying',
            evento: 'fa-solid fa-star',
            pgm: 'fa-solid fa-people-group',
            missões: 'fa-solid fa-globe',
            especial: 'fa-solid fa-gift',
            acampa: 'fa-solid fa-campground',
            comunhão: 'fa-solid fa-users',
            louvor: 'fa-solid fa-music'
        };

        // --- Funções do Modal ---
        const openModal = () => {
            currentDate = new Date(); // Reseta para o mês atual ao abrir
            renderCalendar();
            calendarModal.classList.add('active');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            calendarModal.classList.remove('active');
            document.body.classList.remove('modal-open');
        };

        // --- Funções do Calendário ---
        const renderCalendar = () => {
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            monthYearEl.textContent = `${currentDate.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
            calendarDaysEl.innerHTML = '';
            
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();
            const prevLastDate = new Date(year, month, 0).getDate();

            for (let i = firstDay; i > 0; i--) {
                calendarDaysEl.innerHTML += `<div class="day-cell prev-next-month-day">${prevLastDate - i + 1}</div>`;
            }

            for (let i = 1; i <= lastDate; i++) {
                const today = new Date();
                let classes = 'day-cell';
                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    classes += ' current-day';
                }
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                if (allEvents[dateStr]) {
                    classes += ' event-day';
                }
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
        };

        const showEventsForDate = (dateStr, cell) => {
            document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
            cell.classList.add('selected-day');
            
            const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
            eventDetailsTitle.textContent = `Eventos de ${formattedDate}`;
            
            const events = allEvents[dateStr];
            if (events && events.length > 0) {
                const sortedEvents = events.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
                eventDetailsEl.innerHTML = sortedEvents.map(event => `
                    <div class="event-item">
                        <div class="event-icon"><i class="${eventIcons[event.type.toLowerCase()] || 'fa-solid fa-calendar-day'}"></i></div>
                        <div class="event-info">
                            <strong>${event.title}</strong>
                            <span>${event.time || event.location || ''}</span>
                        </div>
                    </div>`).join('');
            } else {
                eventDetailsEl.innerHTML = '<p>Nenhum evento agendado para este dia.</p>';
            }
        };

        // --- Listeners de Eventos ---
        openCalendarTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
        closeModalBtn.addEventListener('click', closeModal);
        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
        calendarModal.addEventListener('click', (e) => {
            // Fecha o modal se clicar no overlay (fundo)
            if (e.target === calendarModal) {
                closeModal();
            }
        });
    }

    // --- 3. EXECUTA A INICIALIZAÇÃO ---
    initializeCalendarComponent();
});