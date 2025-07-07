// --- START OF FILE componentes/calendario/calendario.js ---

// A lógica é encapsulada em uma IIFE (Immediately Invoked Function Expression)
// para evitar poluir o escopo global, exceto pela API que queremos expor.
(function(window) {
    'use strict';

    // =================================================================================
    // 1. BANCO DE DADOS CENTRAL DE EVENTOS (A ÚNICA FONTE DA VERDADE)
    // =================================================================================
    // Propriedades:
    // - department: 'igreja' ou 'hodos'. Usado para filtrar.
    // - display: Array ['widget', 'carousel', 'calendar']. Controla onde o evento aparece.
    // - date: Formato 'AAAA-MM-DD' para eventos específicos, ou texto para recorrentes.
    const ALL_EVENTS_DATABASE = [
        // --- Eventos do HODOS ---
        { department: 'hodos', date: '2025-04-12', time: '19:00', title: 'Hodos Meet', location: 'IBCT', type: 'louvor', description: 'Um ambiente jovem de louvor, adoração e palavra.', display: ['carousel', 'widget', 'calendar'] },
        { department: 'hodos', date: '2025-05-07', time: '20:00', title: 'Cinema: The Chosen', location: 'ParkShopping', type: 'comunhão', description: 'Encontro para assistir The Chosen no cinema.', display: ['carousel', 'widget', 'calendar'] },
        { department: 'hodos', date: '2025-05-24', time: '10:00', title: 'Hodos Day', location: 'Sítio Campo Maior', type: 'comunhão', description: 'Um dia inteiro de diversão, churrasco e comunhão.', display: ['carousel', 'widget', 'calendar'] },
        { department: 'hodos', date: '2025-06-07', time: '19:00', title: 'Hodos Meet', location: 'IBCT', type: 'louvor', description: 'Mais um encontro para adorarmos juntos.', display: ['carousel', 'widget', 'calendar'] },
        { department: 'hodos', date: '2025-06-14', time: '19:30', title: 'Hodos In Love', location: 'IBCT', type: 'especial', description: 'Noite especial com tema de Dia dos Namorados.', display: ['carousel', 'widget', 'calendar'] },
        { department: 'hodos', date: '2025-06-18', time: '15:00', title: 'Evangelismo com CRU', location: 'Parque de Águas Claras', type: 'missões', description: 'Evangelismo em parceria com a CRU.', display: ['carousel', 'widget', 'calendar'] },
        { department: 'hodos', date: 'Semanalmente', time: '20:00', title: 'PGMs Semanais', location: 'IBCT e Lares', type: 'pgm', recurring: true, externalPage: './eventos/hodos_pgm.html', cardContentHTML: `<iframe src="./tools/logo_pgm.html" style="width:100%; height:100%; border:none; overflow:hidden; background-color: var(--cor-branco);" scrolling="no" title="Animação da logo PGM"></iframe>`, display: ['carousel'] },
        { department: 'hodos', date: 'Agosto de 2025', time: 'A definir', title: 'Hodos Camp 2025', location: 'A definir', type: 'acampa', recurring: true, externalPage: './eventos/hodos_camp_2025.html', description: 'O evento mais esperado do ano!', display: ['carousel', 'widget'] },
        { department: 'hodos', date: 'Ao primeiro sábado do mês', time: '19:00', title: 'Hodos Meet', location: 'IBCT', type: 'meet', recurring: true, cardClass: 'allow-overflow', externalPage: './eventos/hodos_meet.html', cardContentHTML: `<div style="position: relative; width: 100%; height: 100%; background-color: white;"><iframe src="./tools/logo_meet.html" style="width:100%; height:100%; border:none; overflow:hidden; pointer-events: none;" scrolling="no" title="Animação Hodos Meet"></iframe><div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; cursor: pointer; z-index: 5;"></div></div>`, display: ['carousel'] },

        // --- Eventos da IGREJA ---
        { department: 'igreja', date: '2025-04-13', time: '09:00', title: 'EBD', type: 'ebd', display: ['widget', 'calendar'] },
        { department: 'igreja', date: '2025-04-27', time: '09:00', title: 'EBD', type: 'ebd', display: ['widget', 'calendar'] },
        { department: 'igreja', date: '2025-05-18', time: '09:00', title: 'EBD', type: 'ebd', display: ['widget', 'calendar'] },
        { department: 'igreja', date: '2025-05-25', time: '09:00', title: 'EBD', type: 'ebd', display: ['widget', 'calendar'] },
        // ... (outras EBDs ou eventos específicos da igreja podem ser adicionados aqui)
    ];

    // Função auxiliar para gerar eventos recorrentes da igreja (cultos, oração)
    function generateRecurringChurchEvents(year) {
        const events = [];
        for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const currentDate = new Date(year, m, d);
                const dayOfWeek = currentDate.getDay();
                const dateStr = currentDate.toISOString().slice(0, 10);
                if (dayOfWeek === 0) { // Domingo
                    events.push({ department: 'igreja', date: dateStr, time: '10:30', title: 'Culto Matutino', type: 'culto', display: ['widget', 'calendar'] });
                    events.push({ department: 'igreja', date: dateStr, time: '18:00', title: 'Culto Noturno', type: 'culto', display: ['widget', 'calendar'] });
                }
                if (dayOfWeek === 3) { // Quarta-feira
                    events.push({ department: 'igreja', date: dateStr, time: '20:00', title: 'Culto de Oração', type: 'oracao', display: ['widget', 'calendar'] });
                }
            }
        }
        return events;
    }

    const allEventsWithRecurring = [...ALL_EVENTS_DATABASE, ...generateRecurringChurchEvents(2025)];

    // =================================================================================
    // 2. API PÚBLICA (Para ser usada por home-script.js e hodos_script.js)
    // =================================================================================
    window.IBCT_EVENTS_API = {
        /**
         * Retorna uma lista de eventos filtrados.
         * @param {object} options - Opções de filtro.
         * @param {string} options.filter - 'igreja' (só igreja), 'hodos' (igreja + hodos) ou 'all'.
         * @param {string} [options.displayIn] - 'widget', 'carousel', ou 'calendar' para filtrar onde o evento deve aparecer.
         * @returns {Array} - Lista de eventos filtrados.
         */
        getEvents: function(options = {}) {
            const filter = options.filter || 'all';
            return allEventsWithRecurring.filter(event => {
                const departmentMatch = (filter === 'all') ||
                                        (filter === 'igreja' && event.department === 'igreja') ||
                                        (filter === 'hodos' && (event.department === 'igreja' || event.department === 'hodos'));
                const displayMatch = !options.displayIn || (event.display && event.display.includes(options.displayIn));
                return departmentMatch && displayMatch;
            });
        }
    };

    // =================================================================================
    // 3. LÓGICA DO COMPONENTE DE CALENDÁRIO
    // =================================================================================
    
    /**
     * Função principal que inicializa o componente.
     */
    async function initializeComponent() {
        try {
            // document.currentScript refere-se à tag <script> que está executando este código no momento.
            const scriptTag = document.currentScript;
            if (!scriptTag) throw new Error("Não foi possível encontrar a tag do script do calendário para determinar o caminho.");
            
            // Lê os atributos da tag <script> para configurar o componente.
            const pageFilter = scriptTag.getAttribute('data-filter') || 'all';
            const scriptPath = scriptTag.src;
            const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
            const componentUrl = `${scriptDir}/calendario.html`;

            // Busca o conteúdo HTML do modal do calendário.
            const response = await fetch(componentUrl);
            if (!response.ok) throw new Error(`Não foi possível carregar o componente de ${componentUrl}. Status: ${response.status}`);
            
            // Insere o HTML do modal no final do <body>.
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
            
            // Inicia a lógica interativa do calendário.
            setupCalendarLogic(pageFilter);

            // Dispara um evento personalizado para avisar a outras partes do site
            // que a API e o componente estão prontos para uso.
            document.dispatchEvent(new CustomEvent('ibct-api-ready'));

        } catch (error) {
            console.error('Falha ao inicializar o componente de calendário:', error);
        }
    }

    /**
     * Configura toda a interatividade do calendário depois que ele é adicionado ao DOM.
     * @param {string} pageFilter - O filtro ('igreja' ou 'hodos') a ser aplicado no calendário.
     */
    function setupCalendarLogic(pageFilter) {
        // --- Elementos do DOM do Componente ---
        const calendarModal = document.getElementById('calendar-modal-component');
        if (!calendarModal) return;

        const closeModalBtn = calendarModal.querySelector('.modal-close-component');
        const monthYearEl = document.getElementById('month-year-component');
        const calendarDaysEl = document.getElementById('calendar-days-component');
        const eventDetailsEl = document.getElementById('event-details-component');
        const eventDetailsTitle = document.getElementById('event-details-title-component');
        const prevMonthBtn = document.getElementById('prev-month-component');
        const nextMonthBtn = document.getElementById('next-month-component');
        const openCalendarTriggers = document.querySelectorAll('[data-action="open-calendar"]');
        
        let currentDate = new Date();
        
        const eventsForCalendar = window.IBCT_EVENTS_API.getEvents({ filter: pageFilter, displayIn: 'calendar' });
        const allEventsMap = {};
        eventsForCalendar.forEach(event => {
            if (event.date.includes('-')) {
                if (!allEventsMap[event.date]) allEventsMap[event.date] = [];
                allEventsMap[event.date].push(event);
            }
        });

        const eventIcons = { ebd: 'fa-solid fa-book-open', culto: 'fa-solid fa-cross', curso: 'fa-solid fa-graduation-cap', oracao: 'fa-solid fa-hands-praying', evento: 'fa-solid fa-star', pgm: 'fa-solid fa-people-group', missões: 'fa-solid fa-globe', especial: 'fa-solid fa-gift', acampa: 'fa-solid fa-campground', comunhão: 'fa-solid fa-users', louvor: 'fa-solid fa-music', meet: 'fa-solid fa-bolt' };
        
        const openModal = () => {
            currentDate = new Date();
            renderCalendar();
            calendarModal.classList.add('active');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            calendarModal.classList.remove('active');
            if (!document.querySelector('.modal-overlay.active')) {
                document.body.classList.remove('modal-open');
            }
        };

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
                if (allEventsMap[dateStr]) {
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
            if(cell) cell.classList.add('selected-day');
            
            const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
            eventDetailsTitle.textContent = `Eventos de ${formattedDate}`;
            
            const events = allEventsMap[dateStr];
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

        openCalendarTriggers.forEach(trigger => trigger.addEventListener('click', openModal));
        closeModalBtn.addEventListener('click', closeModal);
        prevMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
        nextMonthBtn.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });
        
        calendarModal.addEventListener('click', (e) => {
            if (e.target === calendarModal) {
                closeModal();
            }
        });
    }

    // Inicia todo o processo de inicialização do componente.
    initializeComponent();

})(window);