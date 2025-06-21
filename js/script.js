// --- DADOS DE EVENTOS ESPECÍFICOS ---
// Eventos que não seguem um padrão semanal/mensal são colocados aqui.
const specificEvents = {
    // Aulas de Filipenses
    "2025-04-13": [{ type: 'ebd', time: '09:00', title: 'EBD: Material de Apoio (Filipenses)' }],
    "2025-04-27": [{ type: 'ebd', time: '09:00', title: 'EBD: Aula 5/14 de Filipenses' }],
    "2025-05-18": [{ type: 'ebd', time: '09:00', title: 'EBD: Estudo de Filipenses 3:12-16' }],
    "2025-05-25": [{ type: 'ebd', time: '09:00', title: 'EBD: Estudo de Filipenses 3:17-21' }],
    "2025-06-01": [{ type: 'ebd', time: '09:00', title: 'EBD: Aula Temática "No Jardim com Jesus"' }],
    "2025-06-08": [{ type: 'ebd', time: '09:00', title: 'EBD: Estudo de Filipenses 4:1-5' }],
    "2025-06-15": [{ type: 'ebd', time: '09:00', title: 'EBD: Recapitulação para Prova (Parte 1)' }],
    "2025-06-22": [{ type: 'ebd', time: '09:00', title: 'EBD: Recapitulação para Prova (Parte 2)' }],
    "2025-06-29": [{ type: 'ebd', time: '09:00', title: 'EBD: Recapitulação para Prova (Parte 3)' }],
    // Prova e outros eventos
    "2025-07-06": [{ type: 'ebd', time: '09:00', title: 'Prova Final da EBD (Filipenses)' }],
};

// --- GERAÇÃO DE EVENTOS RECORRENTES ---
function generateRecurringEvents(year) {
    const recurringEvents = {};

    function addEvent(date, event) {
        const dateStr = date.toISOString().slice(0, 10);
        if (!recurringEvents[dateStr]) recurringEvents[dateStr] = [];
        recurringEvents[dateStr].push(event);
    }

    const semesterStart = new Date(year, 2, 1); // 1 de Março
    const semesterEnd = new Date(year, 6, 0); // Fim de Junho

    for (let m = 0; m < 12; m++) {
        const daysInMonth = new Date(year, m + 1, 0).getDate();
        let firstSaturdayFound = false;
        let lastFridayOfMonth = null;

        for (let d = 1; d <= daysInMonth; d++) {
            const currentDate = new Date(year, m, d);
            const dayOfWeek = currentDate.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb

            // --- Eventos Semanais ---
            if (dayOfWeek === 0) { // Domingo
                addEvent(currentDate, { type: 'culto', time: '10:30', title: 'Culto Matutino' });
                addEvent(currentDate, { type: 'food', time: '12:00', title: 'Almoço Dominical (a confirmar)' });
                addEvent(currentDate, { type: 'culto', time: '18:00', title: 'Culto Noturno' });
                addEvent(currentDate, { type: 'food', time: '19:30', title: 'Cantina Pós-Culto (a confirmar)' });
            }
            if (dayOfWeek === 1 && currentDate >= semesterStart && currentDate <= semesterEnd) { // Segunda
                addEvent(currentDate, { type: 'curso', time: '20:00', title: 'Cursos (Mulher Única/CROWN)' });
            }
            if (dayOfWeek === 3) { // Quarta-feira
                addEvent(currentDate, { type: 'culto', time: '20:00', title: 'Culto de Oração' });
                if (currentDate >= semesterStart && currentDate <= semesterEnd) {
                    addEvent(currentDate, { type: 'curso', time: '20:00', title: 'Cursos (Homem ao Máximo)' });
                }
            }
            if (dayOfWeek === 5) { // Sexta-feira
                lastFridayOfMonth = currentDate; // Atualiza a cada sexta, a última será a correta
            }
            if (dayOfWeek === 6 && !firstSaturdayFound) { // Primeiro Sábado
                addEvent(currentDate, { type: 'evento', time: '15:00', title: 'Evento Especial (a confirmar)' });
                firstSaturdayFound = true;
            }
        }
        // --- Eventos Mensais ---
        if(lastFridayOfMonth) {
            addEvent(lastFridayOfMonth, { type: 'oracao', time: '21:00', title: 'Vigília de Oração Online' });
        }
    }
    return recurringEvents;
}

// Junta os eventos específicos com os recorrentes
const allEvents = { ...generateRecurringEvents(2025), ...specificEvents };
Object.keys(specificEvents).forEach(date => {
    if (allEvents[date] && generateRecurringEvents(2025)[date]) {
        allEvents[date] = [...generateRecurringEvents(2025)[date], ...specificEvents[date]];
    }
});


// --- 1. LÓGICA DO MENU HAMBÚRGUER ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
    document.body.classList.toggle('modal-open');
});

// --- 2. LÓGICA DO COUNTDOWN ---
const daysEl = document.getElementById('days'), hoursEl = document.getElementById('hours'), minsEl = document.getElementById('mins'), secsEl = document.getElementById('secs');
const finalExamDate = new Date('2025-07-06T09:00:00');
function updateCountdown() {
    const diff = finalExamDate - new Date();
    if (diff <= 0) {
        document.querySelector('.countdown-timer').innerHTML = "<h4>A Prova já aconteceu!</h4>";
        clearInterval(countdownInterval);
        return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24)), h = Math.floor((diff / (1000 * 60 * 60)) % 24), m = Math.floor((diff / 1000 / 60) % 60), s = Math.floor((diff / 1000) % 60);
    daysEl.innerText = String(d).padStart(2, '0'); hoursEl.innerText = String(h).padStart(2, '0'); minsEl.innerText = String(m).padStart(2, '0'); secsEl.innerText = String(s).padStart(2, '0');
}
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// --- 3. LÓGICA DO CARROSSEL DE AULAS ---
const lessonsScroller = document.querySelector('.lessons-scroller'), prevBtn = document.getElementById('prev-btn'), nextBtn = document.getElementById('next-btn');
if (lessonsScroller) {
    const scrollAmount = 330;
    prevBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => lessonsScroller.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
}

// --- 4. LÓGICA DOS MODAIS ---
const lessonModal = document.getElementById('lesson-modal'), calendarModal = document.getElementById('calendar-modal'), externalContentModal = document.getElementById('external-content-modal'), modalExtraContent = document.getElementById('modal-extra-content');

async function loadExternalContent(url, targetElement) {
    targetElement.innerHTML = '<p>Carregando material...</p>';
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        targetElement.innerHTML = await response.text();
    } catch (error) {
        console.error("Falha ao carregar conteúdo:", error);
        targetElement.innerHTML = `<p style="color:red;">Não foi possível carregar o material.</p>`;
    }
}

document.querySelectorAll('.lesson-card').forEach(card => {
    card.addEventListener('click', () => {
        document.getElementById('modal-title').innerText = card.dataset.title;
        document.getElementById('modal-teacher').innerText = `com ${card.dataset.teacher}`;
        document.getElementById('modal-description').innerText = card.dataset.description;
        document.getElementById('modal-scripture').innerText = `"${card.dataset.scripture}"`;
        modalExtraContent.innerHTML = '';
        
        const externalContentUrl = card.dataset.externalContent;
        if (externalContentUrl) {
            const button = document.createElement('button');
            button.className = 'material-button';
            button.textContent = 'Ver Material de Apoio';
            button.onclick = () => {
                closeAnyModal(lessonModal);
                openAnyModal(externalContentModal);
                loadExternalContent(externalContentUrl, document.getElementById('external-content-body'));
            };
            modalExtraContent.appendChild(button);
        }
        openAnyModal(lessonModal);
    });
});

document.getElementById('open-calendar-link').addEventListener('click', () => {
    currentDateCalendar = new Date();
    renderCalendar();
    openAnyModal(calendarModal);
});

document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', (e) => closeAnyModal(e.target.closest('.modal-overlay'))));

function openAnyModal(modal) { modal.classList.add('active'); document.body.classList.add('modal-open'); }
function closeAnyModal(modal) { modal.classList.remove('active'); if (!navLinks.classList.contains('active')) document.body.classList.remove('modal-open'); }

// --- 5. LÓGICA DO CALENDÁRIO MELHORADO ---
let currentDateCalendar = new Date();
const monthYearEl = document.getElementById('month-year'), calendarDaysEl = document.getElementById('calendar-days'), eventDetailsEl = document.getElementById('event-details'), eventDetailsTitle = document.getElementById('event-details-title');

const eventIcons = { ebd: '📖', culto: '✝️', curso: '✍️', oracao: '🙏', food: '🍴', evento: '🎉' };

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
        dayCell.onclick = () => showEvents(dateStr, dayCell);
        calendarDaysEl.appendChild(dayCell);
    }
    // Seleciona o dia atual por padrão ao renderizar o mês atual
    if (month === new Date().getMonth() && year === new Date().getFullYear()) {
        const todayCell = calendarDaysEl.querySelector('.current-day');
        if (todayCell) todayCell.click();
    } else {
         eventDetailsTitle.textContent = 'Eventos do Dia';
         eventDetailsEl.innerHTML = '<p>Selecione um dia para ver os eventos.</p>';
    }
}

function showEvents(dateStr, cell) {
    document.querySelectorAll('.day-cell.selected-day').forEach(c => c.classList.remove('selected-day'));
    cell.classList.add('selected-day');

    const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    eventDetailsTitle.textContent = `Eventos de ${formattedDate}`;
    const events = allEvents[dateStr];
    if (events && events.length > 0) {
        eventDetailsEl.innerHTML = '';
        events.sort((a,b) => a.time.localeCompare(b.time)).forEach(event => {
            eventDetailsEl.innerHTML += `
                <div class="event-item">
                    <div class="event-icon">${eventIcons[event.type] || '📅'}</div>
                    <div class="event-info">
                        <strong>${event.title}</strong>
                        <span>${event.time}</span>
                    </div>
                </div>`;
        });
    } else {
        eventDetailsEl.innerHTML = '<p>Nenhum evento agendado para este dia.</p>';
    }
}

document.getElementById('prev-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() - 1); renderCalendar(); });
document.getElementById('next-month').addEventListener('click', () => { currentDateCalendar.setMonth(currentDateCalendar.getMonth() + 1); renderCalendar(); });

// --- 6. BOTÃO VOLTAR AO TOPO & 7. ANIMAÇÃO DE SCROLL ---
const scrollToTopBtn = document.querySelector('.scroll-to-top');
window.addEventListener('scroll', () => scrollToTopBtn.classList.toggle('visible', window.scrollY > 300));
scrollToTopBtn.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
const fadeElements = document.querySelectorAll('.fade-in');
const observerFadeIn = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
fadeElements.forEach(el => observerFadeIn.observe(el));
